import Client from "@dagger.io/dagger";

export enum Job {
  codeQuality = "codeQuality",
  test = "test",
  build = "build",
}

const FLUTTER_VERSION = Deno.env.get("FLUTTER_VERSION") || "3.10.3";
const exclude = [
  "android/app/build",
  "android/.gradle",
  ".devbox",
  ".fluentci",
];

export const codeQuality = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.test)
    .container()
    .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
    .withDirectory("/app", context, {
      exclude,
    })
    .withWorkdir("/app")
    .withExec(["flutter", "pub", "global", "activate", "dart_code_metrics"])
    .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
    .withExec([
      "sh",
      "-c",
      "metrics lib -r codeclimate  > gl-code-quality-report.json",
    ]);

  await ctr
    .file("/app/gl-code-quality-report.json")
    .export("./gl-code-quality-report.json");

  const result = await ctr.stdout();

  console.log(result);
};

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.test)
    .container()
    .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
    .withDirectory("/app", context, {
      exclude,
    })
    .withWorkdir("/app")
    .withExec(["flutter", "pub", "global", "activate", "junitreport"])
    .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
    .withExec([
      "sh",
      "-c",
      "flutter test --machine --coverage | tojunit -o report.xml",
    ])
    .withExec(["sh", "-c", "lcov --summary coverage/lcov.info"])
    .withExec(["sh", "-c", "genhtml coverage/lcov.info --output=coverage"]);

  await ctr.file("/app/report.xml").export("./report.xml");
  await ctr.directory("/app/coverage").export("./coverage");

  const result = await ctr.stdout();

  console.log(result);
};

export const build = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const BUILD_OUTPUT_TYPE = Deno.env.get("BUILD_OUTPUT_TYPE") || "apk";
  const ctr = client
    .pipeline(Job.build)
    .container()
    .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
    .withDirectory("/app", context, {
      exclude,
    })
    .withWorkdir("/app")
    .withExec(["flutter", "build", BUILD_OUTPUT_TYPE]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.codeQuality]: codeQuality,
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.codeQuality]: "Run code quality checks",
  [Job.test]: "Run tests",
  [Job.build]: "Build the application",
};
