import axiosInstance from "../../api/axiosInstance";

// Dashboard Stats
export const getDashboardStats = (month, day) => {
  return axiosInstance.get("/admin/dashboard", {
    params: { month, day }
  });
};

// Patients Chart
export const getPatientsChart = (month, page = 1) => {
  return axiosInstance.get("/admin/patients-chart", {
    params: { month, page }
  });
};