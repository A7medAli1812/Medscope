import axiosInstance from "../axios";

export const getMultiHospitalBeds = async () => {
  try {
    const res = await axiosInstance.get("/Hospital/multi-hospital-beds");
    return res.data;
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    throw err;
  }
};