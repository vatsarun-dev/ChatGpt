type CookieOptions = {
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
};

type AppConstant = {
  cookie: Record<"accessToken" | "refreshToken", CookieOptions>;
};

export const appConstant: AppConstant = {
  cookie: {
    accessToken: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },

    refreshToken: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  },
};
