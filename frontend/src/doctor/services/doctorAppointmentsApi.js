import axiosInstance from "../../api/axiosInstance";

// Get Upcoming Appointments
export const getUpcomingAppointments = async (
  date,
  view = "Day",
  page = 1,
  pageSize = 100
) => {
  try {
    const response = await axiosInstance.get(
      "/doctor/appointments/upcoming",
      {
        params: {
          date,
          view,
          page,
          pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "API ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


