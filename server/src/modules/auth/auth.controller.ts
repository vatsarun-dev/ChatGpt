import { Request, Response } from "express";
import AuthService from "./auth.service.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
export default class AuthController {
  constructor() {
    this.authController = new AuthService();
  }

  async loginUserController(req: Request, res: Response) {
    const user = await this.authController.loginUserService(req, res);
    return res.status(200).json({
      message: "User login successfully",
      user: user,
    });
  }

  async registerUserController(req: Request, res: Response) {
    const user = await this.authController.registerUserService(req, res);
    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  }
}
