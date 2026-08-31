type UserModel = {
  id: string;
  name: string;
  password: string;
  email: string;
};
export type LoginUserRequest = Pick<UserModel, "email" | "password">;
export type RegisterUserRequest = Pick<
  UserModel,
  "name" | "email" | "password"
>;
