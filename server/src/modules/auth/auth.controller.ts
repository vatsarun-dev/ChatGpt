import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service.ts";
import type { LoginUserRequest, RegisterUserRequest } from "../../types/response.ts";
import type { AuthenticatedRequest } from "../../types/auth.ts";

export default class AuthController {
  private readonly authController = new AuthService();

  async loginUserController(req: Request, res: Response): Promise<void> {
    const { user, accessToken, refreshToken } =
      await this.authController.loginUserService(
        req.body as LoginUserRequest,
        res,
      );

    res.status(StatusCodes.OK).json({
      message: "User login successfully",
      user,
      accessToken,
      refreshToken,
    });
  }

  async registerUserController(req: Request, res: Response): Promise<void> {
    const { user, accessToken, refreshToken } =
      await this.authController.registerUserService(
        req.body as RegisterUserRequest,
        res,
      );
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
      accessToken,
      refreshToken,
    });
  }

  async refreshPageController(req: Request, res: Response): Promise<void> {
    const access_token = await this.authController.refreshPageService(req, res);

    res.status(StatusCodes.OK).json({
      message: "access_token set",
      access_token: access_token,
    });
  }

  async getMeController(req: Request, res: Response): Promise<void> {
    const user = await this.authController.getMeService(req as AuthenticatedRequest);
    res.status(StatusCodes.OK).json({
      message: "user found",
      user: user,
    });
  }

  async logoutUserController(_req: Request, res: Response): Promise<void> {
    this.authController.logoutUserService(res);
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  }
}
