import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGOURL: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.string(),
  REFRESH_COOKIE_NAME: z.string(),
  MISTRAL_API_KEY: z.string(),
  TVLY_API_KEY: z.string(),
  FRONTEND_URL: z.string(),
});

export type AppEnv = z.infer<typeof envSchema>;
