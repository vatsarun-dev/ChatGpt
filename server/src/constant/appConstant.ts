import env from "../config/env.ts";

type CookieOptions = {
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
};

const isProduction = env.NODE_ENV === "production";

type AppConstant = {
  cookie: Record<"accessToken" | "refreshToken", CookieOptions>;
};

export const appConstant: AppConstant = {
  cookie: {
    accessToken: {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },

    refreshToken: {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  },
};
