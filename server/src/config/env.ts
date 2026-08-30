import { AppEnv } from "../types/env.ts";
import dotenv from "dotenv";
dotenv.config();

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) throw new Error("Environment validation failed");
export default parsed.success;
