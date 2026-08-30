import z from "zod";

export const envSchema = z.object({
  port: z.coerce.number().default(5000),
  MONGOURL: z.string().url("Invalid MongoDB url"),
  nodeEnv: z.enum(["development", "production", "test"]).default("deployment"),
  jwtAccessSecret: z.string(),
  jwtRefreshSecret: z.string(),
  accessTokenTtl: z.string(),
  refreshTokenTtl: z.string(),
  refreshCookieName: z.string(),
  mistralApiKey: z.string().url("please provide me a valid api key"),
  tvlyApiKey: z.string().url("please provide me a valid api key"),
});

export type AppEnv = z.infer<typeof envSchema>;
