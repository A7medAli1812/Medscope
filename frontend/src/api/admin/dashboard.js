import api from "../axios";

export const getDashboardSummary = () => {
  return api.get("/admin/dashboard/summary");
};