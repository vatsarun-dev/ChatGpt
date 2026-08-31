export type AccessTokenPayload = {
  id: string;
  email: string;
  type: "access";
};
export type RefreshTokenPayload = {
  id: string;
  email: string;
  type: "refresh";
};
