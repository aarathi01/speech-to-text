import { HistoryPayload } from "../types/types";
import api from "./api";

export const saveSearchHistory = async (data: HistoryPayload) => {
  await api.post("/history/save", data); 
};

export const getSearchHistory = async () => {
  const res = await api.get("/history/get");
  return res.data;
};
