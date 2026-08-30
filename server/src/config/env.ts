import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  MONGOURL: z.string(),
  PORT: z.string(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) throw new Error("check your env's");
export default parsed.data;
