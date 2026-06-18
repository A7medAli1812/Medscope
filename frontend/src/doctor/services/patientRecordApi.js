import axiosInstance from "../../api/axiosInstance";

export const getPatientRecord = async (patientId) => {
  try {
    const response = await axiosInstance.get(
      `https://med-scope1.runasp.net/api/doctor/patients/${patientId}/record`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching patient record:", error);
    throw error;
  }
};