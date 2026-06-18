import axiosInstance from "../../api/axiosInstance";

// GET all blood data
export const getBloodBank = () => {
  return axiosInstance.get("/admin/BloodBank");
};

// INCREASE
export const increaseBlood = (id) => {
  return axiosInstance.put(`/admin/BloodBank/${id}/increase`);
};

// DECREASE
export const decreaseBlood = (id) => {
  return axiosInstance.put(`/admin/BloodBank/${id}/decrease`);
};