import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};
