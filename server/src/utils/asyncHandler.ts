import type { Request, Response, NextFunction, RequestHandler } from "express";
export default function asyncHandler(
  requestHandler: RequestHandler,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
}
