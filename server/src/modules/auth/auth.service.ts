import type { Request, Response } from "express";
import UserRepo from "../../repository/user.repo.ts";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "../../types/user.ts";
import * as token from "../../utils/generateToken.ts";
import * as error from "../../shared/error/globalError.ts";
import { appConstant } from "../../constant/appConstant.ts";
export default class AuthService {
  constructor() {
    this.authService = new UserRepo();
  }

  async loginUserService(req: Request, res: Response) {
    const { email, password } = req.body as LoginUserRequest;

    if (!email) throw new Error("please fill all the details");

    const user = await this.authService.findByEmail(String(email));

    if (!user) throw new error.NOTFOUNDERROR("the user is not register");

    const compare = await user.comparePassword(password);

    if (!compare) throw new error.UNAUTHORIZED("the password  is incorrect");

    const access_token = token.generateAccessToken(user._id, email);
    const refrest_token = token.generateRefreshToken(user._id, email);

    res.cookie("access_token", access_token, cookie.accessToken);
    return user;
  }

  async registerUserService(req: Request, res: Response) {
    const { name, email, password } = req.body as RegisterUserRequest;
    if (!name || !email || !password)
      throw new Error("all fields are required");

    const isExisted = await this.authService.findByEmail(String(email));
    if (isExisted)
      throw new error.ALLREADYEXIST("the user is already register");
    const user = await this.authService.createUser({ name, email, password });
    const access_token = token.generateAccessToken(user._id, email);
    const refrest_token = token.generateRefreshToken(user._id, email);

    res.cookie("refresh_token", refresh_token, cookie.refreshToken);
    return user;
  }
}
