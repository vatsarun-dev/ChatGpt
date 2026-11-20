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

/** Request shape available after authMiddleware has verified the access token. */
export type AuthenticatedRequest = import("express").Request & {
  user: AccessTokenPayload;
};
