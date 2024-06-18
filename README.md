# Flutter Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/flutter_pipeline)](https://pkg.fluentci.io/flutter_pipeline)
[![deno module](https://shield.deno.dev/x/flutter_pipeline)](https://deno.land/x/flutter_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/flutter)](https://jsr.io/@fluentci/flutter)
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


## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger mod install github.com/fluent-ci-templates/flutter-pipeline@mod
```

## 🛠️ Environment variables

| Variable            | Description            | Default  |
| ------------------- | ---------------------- | -------- |
| `FLUTTER_VERSION`   | Flutter version to use | `3.13.1` |
| `BUILD_OUTPUT_TYPE` | Build output type (`aar`, `apk`, `appbundle`, `bundle`, `linux`, `web`)      | `apk`    |


## ✨ Jobs

| Job          | Description             |
| ------------ | ----------------------- |
| codeQuality  | Run code quality checks |
| test         | Run tests               |
| build        | Build release           |


```typescript
codeQuality(
  src: string | Directory = ".",
  flutterVersion: string = "3.13.1"
): Promise<File | string>
test(
  src?: string | Directory = ".",
  flutterVersion?: string = "3.13.1"
): Promise<Directory | string> 
build(
  src?: string | Directory  = ".",
  flutterVersion?: string = "3.13.1",
  buildOutputType?: string = "apk"
): Promise<Directory | string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { codeQuality, test, build } from "jsr:@fluentci/flutter";

await codeQuality();
await test();
await build();
```
