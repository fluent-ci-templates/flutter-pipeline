# Flutter Pipeline

[![deno module](https://shield.deno.dev/x/flutter_pipeline)](https://deno.land/x/flutter_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/flutter-pipeline)](https://codecov.io/gh/fluent-ci-templates/flutter-pipeline)

A ready-to-use GitLab CI Pipeline and Jobs for your Flutter projects.

## 🚀 Usage

Quick start:

```ts
import { GitLab } from "https://deno.land/x/flutter_pipeline/mod.ts";

const { pipeline } = GitLab;

pipeline.write(); // Write the pipeline to the file .gitlab-ci.yml
```

Or, if you want to use the predefined jobs:

```ts
import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci/mod.ts";
import { GitLab } from "https://deno.land/x/flutter_pipeline/mod.ts";

const { codeQuality, test } = GitLab;

const gitlabci = new GitlabCI()
  .addJob("code_quality", codeQuality)
  .addJob("test", test);

pipeline.write(); // Write the pipeline to the file .gitlab-ci.yml
```

It will generate the following `.gitlab-ci.yml` file:

```yml
# Do not edit this file directly. It is generated by Fluent GitLab CI

code_quality:
  stage: test
  image: ghcr.io/cirruslabs/flutter:3.10.3
  before_script:
    - flutter pub global activate dart_code_metrics
    - export PATH="$PATH:$HOME/.pub-cache/bin"
  script:
    - metrics lib -r codeclimate  > gl-code-quality-report.json
  artifacts:
    reports:
      codequality: gl-code-quality-report.json

test:
  stage: test
  image: ghcr.io/cirruslabs/flutter:3.10.3
  before_script:
    - flutter pub global activate junitreport
    - export PATH="$PATH:$HOME/.pub-cache/bin"
  script:
    - flutter test --machine --coverage | tojunit -o report.xml
    - lcov --summary coverage/lcov.info
    - genhtml coverage/lcov.info --output=coverage
  coverage: "/lines.*: d+.d+%/"
  artifacts:
    name: coverage
    paths:
      - $CI_PROJECT_DIR/coverage
    reports:
      junit: report.xml
```

## 🧪 Advanced Usage

This package also provides a ready-to-use pipeline for [Dagger](https://dagger.io/):

```ts
import Client, { connect } from "@dagger.io/dagger";
import { Dagger } from "https://deno.land/x/flutter_pipeline/mod.ts";

const { codeQuality, test } = Dagger;

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await codeQuality(client, src);
    await test(client, src);
  });
}
```