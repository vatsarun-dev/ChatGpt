import env from "../config/env.ts";

type CookieOptions = {
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
};

// Render may not set NODE_ENV automatically. The deployed frontend uses HTTPS,
// so opt into cross-site cookies whenever its configured origin is HTTPS.
const useCrossSiteCookies =
  env.NODE_ENV === "production" || env.FRONTEND_URL.trim().startsWith("https://");

type AppConstant = {
  cookie: Record<"accessToken" | "refreshToken", CookieOptions>;
};

export const appConstant: AppConstant = {
  cookie: {
    accessToken: {
      httpOnly: true,
      sameSite: useCrossSiteCookies ? "none" : "lax",
      secure: useCrossSiteCookies,
    },

    refreshToken: {
      httpOnly: true,
      sameSite: useCrossSiteCookies ? "none" : "lax",
      secure: useCrossSiteCookies,
    },
  },
};
