import api from "./api";
import { LoginPayload, RegisterPayload } from "../types/types";
import { User } from "../types/userTypes";
import { showSuccess } from "../utils/errorHandler";

export const login = async (data: LoginPayload): Promise<User> => {
  const response = await api.post("/auth/login", data);
  return response.data.user;
};

export const register = (data: RegisterPayload) =>
  api.post("/auth/register", data);

export const logout = () => {
  localStorage.removeItem("isAuthenticated");
  document.cookie = "token=; Max-Age=0; path=/;"; // clears cookie
  window.location.href = "/login";
  showSuccess("Logged out successfully");
};
