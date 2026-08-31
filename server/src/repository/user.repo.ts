import { userModel } from "../models/user.model.ts";

export default class UserRepo {
  async createUser(input: { name: string; email: string; password: string }) {
    const user = await userModel.create({ input });
    return user;
  }

  async findByEmail(email: string) {
    await userModel.findOne({ email });
  }

  async findById(id: string) {
    await userModel.findById(id);
  }
}

export default UserRepo;
