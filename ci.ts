import {
  codeQuality,
  test,
  build,
} from "https://pkg.fluentci.io/flutter_pipeline@v0.7.2/mod.ts";

await codeQuality();
await test();
await build();
