import axiosInstance from "../../api/axiosInstance";

export const getDashboardSummary = () => {
  return axiosInstance.get("/admin/dashboard/summary");
};