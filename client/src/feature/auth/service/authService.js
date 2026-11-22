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
export const api = axios.create({
  baseURL: normalizedApiURL.endsWith("/api")
    ? normalizedApiURL
    : `${normalizedApiURL}/api`,
  withCredentials: true,
});

export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const refreshApi = () => api.post("/auth/refresh");
export const getMeApi = () => api.get("/auth/me");
export const logoutApi = () => api.post("/auth/logout");
