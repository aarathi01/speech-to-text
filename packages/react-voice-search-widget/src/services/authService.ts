import api from "./api";
import { showSuccess } from "../utils/errorHandler";
import { LoginPayload, RegisterPayload } from "../types/types";
import { User } from "../types/userTypes";

export const login = async (data: LoginPayload): Promise<User> => {
  const response = await api.post("/auth/login", data);
  return response.data.user;
};

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data.user;
};

export const logout = () => {
  localStorage.removeItem("isAuthenticated");
  document.cookie = "token=; Max-Age=0; path=/;"; // clears cookie
  window.location.href = "/login";
  showSuccess("Logged out successfully");
};
