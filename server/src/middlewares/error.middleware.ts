import { StatusCodes } from "http-status-codes";
export default async function errorHandler(err, req, res, next) {
  const message: string = err.message || "Internal Server Error";
  const statusCode: number =
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({ message: message });
}
