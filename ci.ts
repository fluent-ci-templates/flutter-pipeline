import { codeQuality, test, build } from "jsr:@fluentci/flutter";

await codeQuality();
await test();
await build();
