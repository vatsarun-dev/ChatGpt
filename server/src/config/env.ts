import { envSchema } from "../types/env.ts";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const envFile = [
  resolve(configDirectory, "../../.env"),
  resolve(configDirectory, "../../../.env"),
].find(existsSync);

if (envFile) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Environment validation failed: ${details}`);
}

export default parsed.data;
