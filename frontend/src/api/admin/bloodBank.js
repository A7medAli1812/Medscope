import api from "../axios";

// GET all blood data
export const getBloodBank = () => {
  return api.get("/admin/BloodBank");
};

// INCREASE
export const increaseBlood = (id) => {
  return api.put(`/admin/BloodBank/${id}/increase`);
};

// DECREASE
export const decreaseBlood = (id) => {
  return api.put(`/admin/BloodBank/${id}/decrease`);
};