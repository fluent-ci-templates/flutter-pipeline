import { Directory, File, Container } from "../../deps.ts";
import { Client } from "../../sdk/client.gen.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  codeQuality = "codeQuality",
  test = "test",
  build = "build",
  dev = "dev",
}

export const exclude = [
  "build",
  "android/app/build",
  "android/.gradle",
  ".devbox",
  ".fluentci",
];

/**
 * @function
 * @description Run code quality checks
 * @param {string | Directory | undefined} src
 * @param {string} flutterVersion
 * @returns {Promise<File | string>}
 */
export async function codeQuality(
  src: string | Directory | undefined = ".",
  flutterVersion: string | undefined = "3.13.1"
): Promise<File | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const FLUTTER_VERSION = Deno.env.get("FLUTTER_VERSION") || flutterVersion;
    const ctr = client
      .pipeline(Job.codeQuality)
      .container()
      .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
      .withMountedCache("/root/.pub-cache", client.cacheVolume("pub-cache"))
      .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
      .withExec(["flutter", "pub", "global", "activate", "dart_code_metrics"])
      .withDirectory("/app", context, {
        exclude,
      })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        "$HOME/.pub-cache/bin/metrics lib -r codeclimate  > gl-code-quality-report.json",
      ]);

    await ctr
      .file("/app/gl-code-quality-report.json")
      .export("./gl-code-quality-report.json");

    await ctr.stdout();

    id = await ctr.file("/app/gl-code-quality-report.json").id();
  });
  return id;
}

/**
 * @function
 * @description Run tests
 * @param {string | Directory | undefined} src
 * @param {string} flutterVersion
 * @returns {Promise<Directory | string>}
 */
export async function test(
  src: string | Directory | undefined = ".",
  flutterVersion: string | undefined = "3.13.1"
): Promise<Directory | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const FLUTTER_VERSION = Deno.env.get("FLUTTER_VERSION") || flutterVersion;
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
      .withMountedCache("/root/.pub-cache", client.cacheVolume("pub-cache"))
      .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
      .withExec(["flutter", "pub", "global", "activate", "junitreport"])
      .withDirectory("/app", context, {
        exclude,
      })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        "flutter test --machine --coverage | $HOME/.pub-cache/bin/tojunit -o report.xml",
      ])
      .withExec(["sh", "-c", "lcov --summary coverage/lcov.info"])
      .withExec(["sh", "-c", "genhtml coverage/lcov.info --output=coverage"]);

    await ctr.file("/app/report.xml").export("./report.xml");
    await ctr.directory("/app/coverage").export("./coverage");

    await ctr.stdout();
    id = await ctr.directory("/app/coverage").id();
  });
  return id;
}

/**
 * @function
 * @description Build the application
 * @param {string | Directory | undefined} src
 * @param {string} buildType
 * @param {boolean} release
 * @param {string} flutterVersion
 * @returns {Promise<File | string>}
 */
export async function build(
  src: Directory | string | undefined = ".",
  buildType?: string,
  release = true,
  flutterVersion: string | undefined = "3.13.1"
): Promise<File | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const FLUTTER_VERSION = Deno.env.get("FLUTTER_VERSION") || flutterVersion;
    const BUILD_OUTPUT_TYPE =
      Deno.env.get("BUILD_OUTPUT_TYPE") || buildType || "apk";
    const args = [];

    if (release) {
      args.push("--release");
    }

    const ctr = client
      .pipeline(Job.build)
      .container()
      .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
      .withMountedCache("/root/.pub-cache", client.cacheVolume("pub-cache"))
      .withMountedCache(
        "/app/android/.gradle",
        client.cacheVolume("android-gradle")
      )
      .withMountedCache("/app/build", client.cacheVolume("android-build"))
      .withDirectory("/app", context, {
        exclude,
      })
      .withWorkdir("/app")
      .withExec(["flutter", "build", BUILD_OUTPUT_TYPE, ...args])
      .withExec(["cp", "-r", "build/app/outputs", "/outputs"]);

    await ctr.stdout();
    id = await ctr
      .file(
        `/outputs/${BUILD_OUTPUT_TYPE === "apk" ? "apk" : "bundle"}/${
          release ? "release" : "debug"
        }/app-${release ? "release" : "debug"}.${
          BUILD_OUTPUT_TYPE === "apk" ? "apk" : "aab"
        }`
      )
      .id();
  });
  return id;
}

/**
 * @function
 * @description Return a Container with Flutter installed
 * @param {string | Directory | undefined} src
 * @param {string} flutterVersion
 * @returns {Promise<File | string>}
 */
export async function dev(
  src: Directory | string | undefined = ".",
  flutterVersion: string | undefined = "3.13.1"
): Promise<Container | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const FLUTTER_VERSION = Deno.env.get("FLUTTER_VERSION") || flutterVersion;
    const ctr = client
      .pipeline(Job.build)
      .container()
      .from(`ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION}`)
      .withMountedCache("/root/.pub-cache", client.cacheVolume("pub-cache"))
      .withMountedCache(
        "/app/android/.gradle",
        client.cacheVolume("android-gradle")
      )
      .withMountedCache("/app/build", client.cacheVolume("android-build"))
      .withDirectory("/app", context, {
        exclude,
      })
      .withWorkdir("/app");

    await ctr.stdout();
    id = await ctr.id();
  });
  return id;
}

export type JobExec = (
  src?: string | Directory
) => Promise<File | Directory | Container | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.codeQuality]: codeQuality,
  [Job.test]: test,
  [Job.build]: build,
  [Job.dev]: dev,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.codeQuality]: "Run code quality checks",
  [Job.test]: "Run tests",
  [Job.build]: "Build the application",
  [Job.dev]: "Return a Container with Flutter installed",
};
