import api from "./api";
import { LoginPayload, RegisterPayload } from "../types/types";

export const login = (data: LoginPayload) => api.post("/auth/login", data);
export const register = (data: RegisterPayload) =>
  api.post("/auth/register", data);
export const logout = () => {
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/login";
};
