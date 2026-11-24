import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../shared/error/ApiError.ts";
export default async function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  const providerMessage = err instanceof Error ? err.message : "";
  if (
    !(err instanceof ApiError) &&
    /user not found|invalid api key|unauthorized/i.test(providerMessage)
  ) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      message:
        "OpenRouter returned an authentication error. Check that OPENROUTER_API_KEY is valid in the deployed server environment; if it is, retry in case of a provider outage.",
    });
  }

  const message: string = err.message || "Internal Server Error";
  const statusCode: number =
    err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({ message: message });
}
