import { User } from "../types/userTypes";
import api from "./api";

export const getAllUsers = () => api.get("/admin/users");
export const promoteToAdmin = (userId: string) => api.put(`/admin/users/${userId}/promote`);
export const deleteUser = (userId: string) => api.delete(`/admin/users/${userId}`);
export const updateUser = (id: string, data: Partial<User>) =>
  api.put(`/admin/users/${id}`, data);

