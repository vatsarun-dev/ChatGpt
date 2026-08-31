import { Request, Response } from "express";
import { LoginUserRequest, RegisterUserRequest } from "../../types/user.ts";
export default class AuthService {
  constructor() {
    this.authService = new UserRepo();
  }

  async loginUserService(req: Request, res: Response) {
    const { email, password } = req.body as LoginUserRequest;

    if (!email) throw new Error("please fill all the details");

    const user = await this.authService.findByEmail(String(email));

    if (!user) throw new Error("the user is not register");

    const compare = comparePassword(password);

    if (!compare) throw new Error("the password  is incorrect");

    return user;
  }

  async registerUserService(req: Request, res: Response) {
    const { name, email, password } = req.body as RegisterUserRequest;
    if (!name || !email || !password)
      throw new Error("all fields are required");

    const isExisted = await this.authService.findByEmail(String(email));
    if (isExisted) throw new Error("the user is already register");
    const user = await this.authService.createUser({ name, email, password });
    return user;
  }
}
