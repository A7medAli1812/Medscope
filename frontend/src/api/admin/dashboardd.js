import api from "../axios";

// Dashboard Stats
export const getDashboardStats = (month, day) => {
  return api.get("/admin/dashboard", {
    params: { month, day }
  });
};

// Patients Chart
export const getPatientsChart = (month, page = 1) => {
  return api.get("/admin/patients-chart", {
    params: { month, page }
  });
};