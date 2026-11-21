import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.ts";
import type { AccessTokenPayload } from "../types/auth.ts";
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required. Please sign in again." });
    }

    const decode = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    (req as Request & { user: AccessTokenPayload }).user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : "Invalid authentication token",
    });
  }
}
