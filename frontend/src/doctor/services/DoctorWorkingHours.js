import axiosInstance from '../../api/axiosInstance';

export const getDoctorWorkingHours = async () => {
  try {
    const response = await axiosInstance.get('/doctor/working-hours');
    return response.data;
  } catch (error) {
    console.error('Error fetching working hours:', error);
    throw error;
  }
};

export const updateDoctorWorkingHours = async (schedule, appointmentDuration) => {
  try {
    const payload = {
      appointmentDuration,
      workingDays: schedule
        .filter((item) => item.enabled)
        .map((item) => ({
          day: item.day,
          from: item.startTime,
          to: item.endTime,
        })),
    };

    const response = await axiosInstance.post('/doctor/working-hours', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating working hours:', error);
    throw error;
  }
};