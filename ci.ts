import {
  codeQuality,
  test,
  build,
} from "https://pkg.fluentci.io/flutter_pipeline@v0.5.1/mod.ts";

await codeQuality();
await test();
await build();
