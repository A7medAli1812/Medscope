import axios from "axios";

const BASE_URL =
  "https://med-scope1.runasp.net/api/doctor";

export const deletePatient = async (
  patientId
) => {
  const token =
    localStorage.getItem("token");

  const response = await axios.delete(
    `${BASE_URL}/patients/${patientId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};