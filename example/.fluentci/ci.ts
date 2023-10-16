import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  codeQuality,
  test,
  build,
} from "https://pkg.fluentci.io/flutter_pipeline@v0.4.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await codeQuality(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
