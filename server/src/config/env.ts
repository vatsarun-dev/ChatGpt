import { envSchema } from "../types/env.ts";
import dotenv from "dotenv";
dotenv.config();

const parsed = envSchema.safeParse(process.env);
console.log(parsed.success);
if (!parsed.success) throw new Error("Environment validation failed");

export default parsed.data;
