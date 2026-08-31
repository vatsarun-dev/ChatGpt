import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../shared/error/ApiError.ts";
export default async function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const message: string = err.message || "Internal Server Error";
  const statusCode: number =
    err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({ message: message });
}
