import axiosInstance from "../../api/axiosInstance";

export const addChronicDisease = async (
  appointmentId,
  data
) => {
  const response = await axiosInstance.post(
    `/doctor/medical-history/${appointmentId}/chronic-disease`,
    data
  );

  return response.data;
};

export const addSurgery = async (
  appointmentId,
  data
) => {
  const response = await axiosInstance.post(
    `/doctor/medical-history/${appointmentId}/surgery`,
    data
  );

  return response.data;
};

export const addMedication = async (
  appointmentId,
  data
) => {
  const response = await axiosInstance.post(
    `/doctor/medical-history/${appointmentId}/medication`,
    data
  );

  return response.data;
};

export const addAllergy = async (
  appointmentId,
  data
) => {
  const response = await axiosInstance.post(
    `/doctor/medical-history/${appointmentId}/allergy`,
    data
  );

  return response.data;
};