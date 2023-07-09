import { Job } from "fluent_gitlab_ci";

export const codeQuality = new Job()
  .stage("test")
  .image("ghcr.io/cirruslabs/flutter:3.10.3")
  .beforeScript(
    `
    flutter pub global activate dart_code_metrics
    export PATH="$PATH:$HOME/.pub-cache/bin"
  `
  )
  .script("metrics lib -r codeclimate  > gl-code-quality-report.json")
  .artifacts({
    reports: {
      codequality: "gl-code-quality-report.json",
    },
  });

export const test = new Job()
  .stage("test")
  .image("ghcr.io/cirruslabs/flutter:3.10.3")
  .beforeScript(
    `
    flutter pub global activate junitreport
    export PATH="$PATH:$HOME/.pub-cache/bin"
  `
  )
  .script(
    `
    flutter test --machine --coverage | tojunit -o report.xml
    lcov --summary coverage/lcov.info
    genhtml coverage/lcov.info --output=coverage
  `
  )
  .coverage(`/lines\.*: \d+\.\d+\%/`)
  .artifacts({
    name: "coverage",
    paths: ["$CI_PROJECT_DIR/coverage"],
    reports: {
      junit: "report.xml",
    },
  });
