import express from "express";
export default function createApp() {
  const app = express();
  securityMiddleware(app);
  return app;
}
