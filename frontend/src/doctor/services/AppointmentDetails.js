import axiosInstance from "../../api/axiosInstance";

export const getAppointmentDetails = async (
  appointmentId
) => {
  const response = await axiosInstance.get(
    `/doctor/appointments/visit-details/${appointmentId}`
  );

  return response.data;
};