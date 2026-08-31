import type { Request, Response } from "express";
import UserRepo from "../../repository/user.repo.ts";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "../../types/user.ts";
import * as error from "../../shared/error/globalError.ts";
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
    return user;
  }
}
