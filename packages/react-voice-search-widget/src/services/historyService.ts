import { HistoryPayload } from "../types/types";
import api from "./api";

export const saveSearchHistory = async (data: HistoryPayload) => {
  await api.post("/history/save", data);
};

export const getSearchHistory = async () => {
  const res = await api.get("/history/get");
  return res.data;
};

export const getUserSearchHistory = (userId: string) =>
  api.get(`/admin/users/${userId}/history`);

export const deleteUserSearchEntry = (userId: string, historyId: string) =>
  api.delete(`/admin/users/${userId}/history/${historyId}`);

export const deleteOwnSearchEntry = (historyId: string) =>
  api.delete(`/history/${historyId}`);
