import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.ts";

export class NOTFOUNDERROR extends ApiError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
export class UNAUTHORIZED extends ApiError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}
export class ALLREADYEXIST extends ApiError {
  constructor(message: string) {
    super(StatusCodes.CONFLICT, message);
  }
}
