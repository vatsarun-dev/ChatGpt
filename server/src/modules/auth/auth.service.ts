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
export default class AuthService {
  private readonly authService = new UserRepo()

  private toResponseUser(
    user: AuthResponseUser,
  ): Pick<AuthResponseUser, "id" | "name" | "email"> {
    return{
      id:user.id,
      name:user.name,
      email:user.email
    }
  }

  private async issueAuthCookies(user: AuthResponseUser, res: Response): Promise<void> {
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


  async loginUserService(req:LoginUserRequest , res: Response):Promise<AuthResponseUser> {
    const { email, password } = req;

    if (!email || !password) throw new Error("please fill all the details");

    const user = await this.authService.findByEmail(String(email));

    if (!user) throw new error.NOTFOUNDERROR("the user is not register");

    const compare = await user.comparePassword(password);

    if (!compare) throw new error.UNAUTHORIZED("the password  is incorrect");

    const access_token = token.generateAccessToken({
      id: String(user._id),
      email: user.email,
      type: "access",
    });
    const refresh_token = token.generateRefreshToken({
      id: String(user._id),
      email: user.email,
      type: "refresh_token",
    });

    res.cookie("access_token", access_token, appConstant.cookie.accessToken);
    res.cookie("refresh_token", refresh_token, appConstant.cookie.refreshToken);

    return user;
  }

  async registerUserService(req: RegisterUserRequest, res: Response) {
    const { name, email, password } = req;
    if (!name || !email || !password)
      throw new Error("all fields are required");

    const isExisted = await this.authService.findByEmail(String(email));
    if (isExisted)
      throw new error.ALLREADYEXIST("the user is already register");
    const user = await this.authService.createUser({ name, email, password });
    const access_token = token.generateAccessToken({
      id: String(user._id),
      email: user.email,
      type: "access",
    });
    const refresh_token = token.generateRefreshToken({
      id: String(user._id),
      email: user.email,
      type: "refresh_token",
    });

    res.cookie("access_token", access_token, appConstant.cookie.accessToken);
    res.cookie("refresh_token", refresh_token, appConstant.cookie.refreshToken);
    return user;
  }

  async refreshPageService(req: Request, res: Response) {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) throw new error.NOTFOUNDERROR("token not found");
    const user = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET) as {
      id: string;
      email: string;
    };
    if (!user) throw new error.NOTFOUNDERROR("no user found");
    const access_token = token.generateAccessToken({
      id: String(user.id),
      email: user.email,
      type: "access",
    });
    res.cookie("access_token", access_token, appConstant.cookie.accessToken);

    return access_token;
  }

  async getMeService(req: Request) {
    const user = await this.authService.findById(req.user.id);
    if (!user) throw new error.NOTFOUNDERROR("no user found");

    return user;
  }
}
