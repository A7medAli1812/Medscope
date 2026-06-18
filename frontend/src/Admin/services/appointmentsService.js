import axiosInstance from "../../api/axiosInstance";

// patients
export const getPatients = async () => {
  const res = await axiosInstance.get("/admin/patients");
  return res.data;
};

// doctors
export const getDoctors = async () => {
  const res = await axiosInstance.get("/Doctor");
  return res.data;
};

// available dates
export const getAvailableDates = async (doctorId) => {
  const res = await axiosInstance.get("/booking/available-dates", {
    params: { doctorId }
  });
  return res.data;
};

// available slots
export const getAvailableSlots = async (doctorId, date) => {
  const res = await axiosInstance.get("/booking/available-slots", {
    params: { doctorId, date }
  });
  return res.data;
};

// create appointment
export const createAppointment = async (data) => {
  const res = await axiosInstance.post("/admin/appointments", data);
  return res.data;
};