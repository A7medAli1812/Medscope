import axiosInstance from "../../api/axiosInstance";

const BASE_URL = "/Doctor";

// GET (with pagination + filters)
export const getDoctors = async (params) => {
  const response = await axiosInstance.get(BASE_URL, { params });
  return response.data;
};

// GET BY ID
export const getDoctorById = async (id) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

// CREATE
export const createDoctor = async (data) => {
  const response = await axiosInstance.post(`${BASE_URL}/create`, data);
  return response.data;
};

// UPDATE
export const updateDoctor = async (id, data) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// DELETE
export const deleteDoctor = async (id) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// TOGGLE STATUS (Active/Inactive)
export const toggleDoctorStatus = async (doctorId) => {
  const response = await axiosInstance.patch(`${BASE_URL}/toggle-status/${doctorId}`);
  return response.data;
};