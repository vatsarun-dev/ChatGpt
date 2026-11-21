import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
export const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const refreshApi = () => api.post("/auth/refresh");
export const getMeApi = () => api.get("/auth/me");
export const logoutApi = () => api.post("/auth/logout");
