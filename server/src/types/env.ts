import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGOURL: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  OPENROUTER_API_KEY: z.string().trim().min(1),
  OPENROUTER_MODEL: z.string().trim().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;
