import express from "express";
import securityMiddleware from "../middlewares/security.middleware.ts";
import errorHandler from "../middlewares/error.middleware.ts";
export default function createApp() {
  const app = express();
  securityMiddleware(app);

  errorHandler();
  return app;
}
