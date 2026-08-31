import axios from "axios";
const apiURL = import.meta.env.FRONTEND_URL ?? "http://localhost:3000/api";
export const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
