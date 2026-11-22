import axios from "axios";
const apiURL =
  import.meta.env.VITE_API_URL ?? "https://chatgpt-2icw.onrender.com";
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
