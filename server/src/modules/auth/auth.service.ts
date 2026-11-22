import type { Request, Response } from "express";
import UserRepo from "../../repository/user.repo.ts";
import type {
  LoginUserRequest,
  RegisterUserRequest,
  AuthResponseUser,
} from "../../types/response.ts";
import * as token from "../../utils/generateToken.ts";
import * as error from "../../shared/error/globalError.ts";
import { appConstant } from "../../constant/appConstant.ts";
import jwt from "jsonwebtoken";
import env from "../../config/env.ts";
import type { AuthenticatedRequest } from "../../types/auth.ts";
import type { UserDocument } from "../../models/user.model.ts";
export default class AuthService {
  private readonly authService = new UserRepo();

  private toResponseUser(user: Pick<UserDocument, "_id" | "name" | "email">): AuthResponseUser {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }

  private async issueAuthCookies(
    user: AuthResponseUser,
    res: Response,
  ): Promise<void> {
    const accessToken = token.generateAccessToken({
      id: String(user.id),
      email: user.email,
      type: "access",
    });
    const refreshToken = token.generateRefreshToken({
      id: String(user.id),
      email: user.email,
      type: "refresh",
    });

    res.cookie("access_token", accessToken, appConstant.cookie.accessToken);
    res.cookie("refresh_token", refreshToken, appConstant.cookie.refreshToken);
  }

  async registerUserService(req: RegisterUserRequest, res: Response) {
    const { name, email, password } = req;
    if (!name || !email || !password)
      throw new Error("all fields are required");

    const isExisted = await this.authService.findByEmail(String(email));
    if (isExisted)
      throw new error.ALLREADYEXIST("the user is already register");
    const user = await this.authService.createUser({ name, email, password });
    const responseUser = this.toResponseUser(user);
    await this.issueAuthCookies(responseUser, res);
    return responseUser;
  }

  async loginUserService(
    req: LoginUserRequest,
    res: Response,
  ): Promise<AuthResponseUser> {
    const { email, password } = req;

    if (!email || !password) throw new Error("please fill all the details");

    const user = await this.authService.findByEmail(String(email));

    if (!user) throw new error.NOTFOUNDERROR("the user is not register");

    const compare = await (
      user as typeof user & {
        comparePassword(password: string): Promise<boolean>;
      }
    ).comparePassword(password);

    if (!compare) throw new error.UNAUTHORIZED("the password  is incorrect");

    const responseUser = this.toResponseUser(user);
    await this.issueAuthCookies(responseUser, res);

    return responseUser;
  }

  async refreshPageService(req: Request, res: Response) {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) throw new error.UNAUTHORIZED("refresh token not found");
    const user = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET) as {
      id: string;
      email: string;
    };
    if (!user) throw new error.UNAUTHORIZED("invalid refresh token");
    const access_token = token.generateAccessToken({
      id: String(user.id),
      email: user.email,
      type: "access",
    });
    res.cookie("access_token", access_token, appConstant.cookie.accessToken);

    return access_token;
  }

  async getMeService(req: AuthenticatedRequest) {
    const user = await this.authService.findById(req.user.id);
    if (!user) throw new error.NOTFOUNDERROR("no user found");

    return this.toResponseUser(user);
  }

  logoutUserService(res: Response): void {
    res.clearCookie("access_token", appConstant.cookie.accessToken);
    res.clearCookie("refresh_token", appConstant.cookie.refreshToken);
  }
}
