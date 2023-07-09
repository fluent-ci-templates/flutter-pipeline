import { GitlabCI } from "fluent_gitlab_ci";
import { codeQuality, test } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .addJob("code_quality", codeQuality)
  .addJob("test", test);

export default gitlabci;
