import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { codeQuality, test } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .addJob("code_quality", codeQuality)
  .addJob("test", test);

export default gitlabci;
