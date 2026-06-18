import axiosInstance from "../../api/axiosInstance.js"; //دي هعدلها المسار الصحيح لملف axios.js اللي انت عامل فيه الاعدادات بتاعتك للاتصال بالسيرفر

// ============================
// Hospitals
// ============================

export const getHospitals = (params = {}) =>
  axiosInstance.get("/super-admin/hospitals", { params });

export const getAllHospitals = () =>
  axiosInstance.get("/super-admin/All-hospitals");

export const createHospital = (data) =>
  axiosInstance.post("/super-admin/create-hospital", data);

export const updateHospital = (id, data) =>
  axiosInstance.put(`/super-admin/hospitals/${id}`, data);

export const deleteHospital = (id) =>
  axiosInstance.delete(`/super-admin/hospitals/${id}`);

export const changeHospitalStatus = (id, isActive) =>
  axiosInstance.patch(`/super-admin/hospitals/${id}/status`, { isActive });

// ============================
// Admins
// ============================

export const getAdmins = (params = {}) =>
  axiosInstance.get("/super-admin/admins", { params });

export const createAdmin = (data) =>
  axiosInstance.post("/super-admin/admins", data);

export const updateAdmin = (id, data) =>
  axiosInstance.put(`/super-admin/admins/${id}`, data);

export const toggleAdminStatus = (id) =>
  axiosInstance.patch(`/super-admin/admins/${id}/toggle-status`);

// ============================
// Reports
// ============================

export const getReports = (month = 1) =>
  axiosInstance.get("/super-admin/reports", { params: { month, Month: month } });

export const exportAdminsPdf = () =>
  axiosInstance.get("/super-admin/reports/admins/pdf", {
    responseType: "blob",
  });

export const exportAdminsExcel = () =>
  axiosInstance.get("/super-admin/reports/admins/excel", {
    responseType: "blob",
  });

export const exportDashboardPdf = (month = 1) =>
  axiosInstance.get("/super-admin/reports/dashboard/pdf", {
    params: { month, Month: month },
    responseType: "blob",
  });

export const exportDashboardExcel = (month = 1) =>
  axiosInstance.get("/super-admin/reports/dashboard/excel", {
    params: { month, Month: month },
    responseType: "blob",
  });

// ============================
// Profile & Settings
// ============================

export const getProfile = () => axiosInstance.get("/super-admin/profile");

export const updateProfile = (data) =>
  axiosInstance.put("/super-admin/profile", data);

export const changePassword = (data) =>
  axiosInstance.post("/super-admin/change-password", data);

export const updateNotifications = (data) =>
  axiosInstance.put("/super-admin/notifications", data);

// ============================
// System Summary
// ============================

export const getSystemSummary = () =>
  axiosInstance.get("/super-admin/system-summary");
