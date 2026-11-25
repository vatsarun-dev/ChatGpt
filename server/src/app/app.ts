import express from "express";
import securityMiddleware from "../middlewares/security.middleware.ts";
import errorHandler from "../middlewares/error.middleware.ts";
import authRoutes from "../modules/auth/auth.routes.ts";
import chatRoutes from "../modules/chat/chat.routes.ts";

export default function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  securityMiddleware(app);

  app.use("/api/auth", authRoutes);
  app.use("/api/person1", chatRoutes);
  app.use(errorHandler);
  return app;
}
