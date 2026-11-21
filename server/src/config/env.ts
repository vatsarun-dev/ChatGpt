import { envSchema } from "../types/env.ts";
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const envFile = resolve(dirname(fileURLToPath(import.meta.url)), "../../.env");
dotenv.config({ path: envFile });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Environment validation failed: ${details}`);
}

export default parsed.data;
