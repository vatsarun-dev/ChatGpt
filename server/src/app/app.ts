import express from "express";
import securityMiddleware from "../middlewares/security.middleware.ts";
import errorHandler from "../middlewares/error.middleware.ts";
import authRoutes from "../modules/auth/auth.routes.ts";

export default function createApp() {
  const app = express();
  securityMiddleware(app);

  app.use("/api/auth", authRoutes);
  app.use(errorHandler);
  return app;
}
