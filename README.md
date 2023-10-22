# Flutter Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fflutter_pipeline&query=%24.version)](https://pkg.fluentci.io/flutter_pipeline)
[![deno module](https://shield.deno.dev/x/flutter_pipeline)](https://deno.land/x/flutter_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![coverage](https://img.shields.io/codecov/c/gh/fluent-ci-templates/flutter-pipeline)](https://codecov.io/gh/fluent-ci-templates/flutter-pipeline)

A ready-to-use Pipeline for your [Flutter](https://flutter.dev/) projects.

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run flutter_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t flutter
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
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


```graphql
build(src: String!): String
codeQuality(src: String!): String
test(src: String!): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { codeQuality, test, build } from "https://pkg.fluentci.io/flutter_pipeline@v0.5.0/mod.ts";

await codeQuality();
await test();
await build();
```
