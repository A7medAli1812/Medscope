import axiosInstance from "../../api/axiosInstance";

// ✅ GET new (with server-side pagination, search, date)
export const getNewAppointments = ({ page = 1, pageSize = 10, search = "", date = "" } = {}) => {
  const params = { page, pageSize };
  if (search) params.search = search;
  if (date) params.date = date;
  return axiosInstance.get("/admin/appointments/new", { params });
};

// ✅ GET completed (with server-side pagination, search, date)
export const getCompletedAppointments = ({ page = 1, pageSize = 10, search = "", date = "" } = {}) => {
  const params = { page, pageSize };
  if (search) params.search = search;
  if (date) params.date = date;
  return axiosInstance.get("/admin/appointments/completed", { params });
};

// ✅ POST create new appointment
export const createAppointment = (data) => {
  return axiosInstance.post("/admin/appointments", data);
};

// ✅ PUT cancel
export const cancelAppointment = (id) => {
  return axiosInstance.put(`/admin/appointments/${id}/cancel`);
};

// ✅ PUT reschedule
export const rescheduleAppointment = (id, data) => {
  return axiosInstance.put(`/admin/appointments/${id}/reschedule`, data);
};

// ✅ PUT complete
export const completeAppointment = (id) => {
  return axiosInstance.put(`/admin/appointments/${id}/complete`);
};

// ✅ GET by id
export const getAppointmentById = (id) => {
  return axiosInstance.get(`/admin/appointments/${id}`);
};