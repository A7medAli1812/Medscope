import api from "../axios";

// 🔥 get all patients (with filters)
export const getPatients = (params) => {
  return api.get("/admin/patients", { params });
};

// get by id (لو احتجته بعدين)
export const getPatientById = (id) => {
  return api.get(`/admin/patients/${id}`);
};

// delete
export const deletePatient = (id) => {
  return api.delete(`/admin/patients/${id}`);
};
// 📊 patients chart
export const getPatientsChart = (params) => {
  return api.get("/admin/patients-chart", { params });
};