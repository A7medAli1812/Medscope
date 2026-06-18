import axiosInstance from '../../api/axiosInstance';

const DASHBOARD_URL = '/patient/dashboard';

export const getDashboardData = async () => {
  const response = await axiosInstance.get(DASHBOARD_URL);
  return response.data;
};