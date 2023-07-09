import Client from "@dagger.io/dagger";

export const codeQuality = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("code_quality")
    .container()
    .from("ghcr.io/cirruslabs/flutter:3.10.3")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["flutter", "pub", "global", "activate", "dart_code_metrics"])
    .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
    .withExec([
      "sh",
      "-c",
      "metrics lib -r codeclimate  > gl-code-quality-report.json",
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("test")
    .container()
    .from("ghcr.io/cirruslabs/flutter:3.10.3")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["flutter", "pub", "global", "activate", "junitreport"])
    .withEnvVariable("PATH", "$PATH:$HOME/.pub-cache/bin", { expand: true })
    .withExec([
      "sh",
      "-c",
      "flutter test --machine --coverage | tojunit -o report.xml",
    ])
    .withExec(["lcov", "--summary", "coverage/lcov.info"])
    .withExec(["genhtml", "coverage/lcov.info", "--output=coverage"]);

  const result = await ctr.stdout();

  console.log(result);
};
