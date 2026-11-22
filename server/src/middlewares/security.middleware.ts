import hpp from "hpp";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import env from "../config/env.ts";
export default function securityMiddleware(app: Express) {
  const frontendOrigin = env.FRONTEND_URL.trim().replace(/\/+$/, "");
  const allowedOrigins = [
    frontendOrigin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean);
  app.use(morgan("dev"));
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ extended: true, limit: "3mb" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      exposedHeaders: ["X-Conversation-Id"],
    }),
  );
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      message: "too much devices",
      limit: 100,
      legacyHeaders: true,
    }),
  );
}
