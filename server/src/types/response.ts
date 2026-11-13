export type AuthResponseUser = {
  id: string;
  name: string;
  email: string;
};

export type RegisterUserRequest = Pick<AuthResponseUser, "name" | "email"> & {
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};
