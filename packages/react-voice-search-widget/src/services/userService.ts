import { User } from "../types/userTypes";
import api from "./api";

export const getAllUsers = (page = 1)=> api.get(`/admin/users?page=${page}`);
export const promoteToAdmin = (id: string) =>
  api.put(`/admin/users/${id}/promote`);
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const updateUser = (id: string, data: Partial<User>) =>
  api.put(`/admin/users/${id}`, data);
export const blockUser = (id: string) => api.put(`/admin/users/${id}/block`);
export const unblockUser = (id: string) =>
  api.put(`/admin/users/${id}/unblock`);
