import { NOTFOUNDERROR, UNAUTHORIZED } from "../shared/error/globalError.ts";
import type { Request, Response, NextFunction } from "express";
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.access_token;
    if (!token) throw new NOTFOUNDERROR("no token found");

    const decode = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (!decode) throw new UNAUTHORIZED("UNAUTHORIZED USER");
    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
