import jwt from "jsonwebtoken";
import env from "../config/env.ts";
import type { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.ts";
export function generateAccessToken(Payload: AccessTokenPayload): string {
  return jwt.sign({ Payload }, env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
}
export function generateRefreshToken(id: number): string {
  return jwt.sign({ id: id }, env.JWT_REFRESH_SECRET, { expiresIn: "15d" });
}
