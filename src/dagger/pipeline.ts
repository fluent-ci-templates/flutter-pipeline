import Client, { connect } from "@dagger.io/dagger";
import { codeQuality, test } from "./jobs.ts";

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await codeQuality(client, src);
    await test(client, src);
  });
}
