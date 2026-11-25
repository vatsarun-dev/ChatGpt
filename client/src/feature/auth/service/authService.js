import axios from "axios";

const productionApiURL = "https://chatgpt-2icw.onrender.com";
const configuredApiURL = import.meta.env.VITE_API_URL?.trim();
const isLoopbackURL = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
  configuredApiURL || "",
);
const apiURL =
  import.meta.env.PROD && isLoopbackURL
    ? productionApiURL
    : configuredApiURL ||
      (import.meta.env.DEV ? "http://localhost:5000" : productionApiURL);
const normalizedApiURL = apiURL.replace(/\/+$/, "");

const ACCESS_TOKEN_KEY = "chatgpt_access_token";
const REFRESH_TOKEN_KEY = "chatgpt_refresh_token";

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthTokens({ accessToken, refreshToken } = {}) {
  try {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // Ignore storage errors in restricted browsing modes.
  }
}

export function clearAuthTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage errors in restricted browsing modes.
  }
}

export function extractApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((item) => item.msg).filter(Boolean).join(" • ");
  }
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "Unable to reach the server. Please wait a moment and try again.";
  }
  return error?.message || fallback;
}

export const api = axios.create({
  baseURL: normalizedApiURL.endsWith("/api")
    ? normalizedApiURL
    : `${normalizedApiURL}/api`,
  withCredentials: true,
  timeout: 65000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerApi = async (data) => {
  const response = await api.post("/auth/register", data);
  setAuthTokens({
    accessToken: response.data?.accessToken,
    refreshToken: response.data?.refreshToken,
  });
  return response;
};

export const loginApi = async (data) => {
  const response = await api.post("/auth/login", data);
  setAuthTokens({
    accessToken: response.data?.accessToken,
    refreshToken: response.data?.refreshToken,
  });
  return response;
};

export const refreshApi = async () => {
  const refreshToken = getRefreshToken();
  const response = await api.post(
    "/auth/refresh",
    refreshToken ? { refreshToken } : {},
  );
  setAuthTokens({
    accessToken: response.data?.access_token,
  });
  return response;
};

export const getMeApi = () => api.get("/auth/me");

export const logoutApi = async () => {
  try {
    return await api.post("/auth/logout");
  } finally {
    clearAuthTokens();
  }
};
