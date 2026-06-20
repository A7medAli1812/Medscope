import api from "../axios";

// ✅ GET new
export const getNewAppointments = () => {
  return api.get("/admin/appointments/new");
};

// ✅ GET completed
export const getCompletedAppointments = () => {
  return api.get("/admin/appointments/completed");
};

// ✅ POST create new appointment
export const createAppointment = (data) => {
  return api.post("/admin/appointments", data);
};

// ✅ PUT cancel
export const cancelAppointment = (id) => {
  return api.put(`/admin/appointments/${id}/cancel`);
};

// ✅ PUT reschedule
export const rescheduleAppointment = (id, data) => {
  return api.put(`/admin/appointments/${id}/reschedule`, data);
};

// ✅ PUT complete
export const completeAppointment = (id) => {
  return api.put(`/admin/appointments/${id}/complete`);
};

// ✅ GET by id
export const getAppointmentById = (id) => {
  return api.get(`/admin/appointments/${id}`);
};