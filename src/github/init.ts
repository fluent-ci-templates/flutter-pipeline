import { generateYaml } from "./config.ts";

generateYaml().save(".github/workflows/workflow.yml");
