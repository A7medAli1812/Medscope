import axios from "axios";

export const getPatients = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://med-scope1.runasp.net/api/doctor/patients",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};