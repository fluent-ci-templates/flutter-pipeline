# Flutter Pipeline

[![deno module](https://shield.deno.dev/x/flutter_pipeline)](https://deno.land/x/flutter_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/flutter-pipeline)](https://codecov.io/gh/fluent-ci-templates/flutter-pipeline)

A ready-to-use Pipeline for your [Flutter](https://flutter.dev/) projects.

## 🚀 Usage

Run the following command in your project:

```bash
dagger run fluentci flutter_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t flutter
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Environment variables

| Variable            | Description            | Default  |
| ------------------- | ---------------------- | -------- |
| `FLUTTER_VERSION`   | Flutter version to use | `3.13.1` |
| `BUILD_OUTPUT_TYPE` | Build output type (`aar`, `apk`, `appbundle`, `bundle`, `linux`, `web`)      | `apk`    |


## Jobs

| Job          | Description             |
| ------------ | ----------------------- |
| codeQuality  | Run code quality checks |
| test         | Run tests               |
| build        | Build release           |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/flutter_pipeline/mod.ts";

const { codeQuality, test, build } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await codeQuality(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
