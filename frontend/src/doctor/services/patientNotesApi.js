import axiosInstance from "../../api/axiosInstance";

// ================= GET NOTES =================
export const getPatientNotes = async (patientId) => {
  try {
    const response = await axiosInstance.get(
      `https://med-scope1.runasp.net/api/doctor/patients/${patientId}/notes`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

// ================= ADD NOTE =================
export const addPatientNote = async (
  patientId,
  noteData
) => {
  try {
    const response = await axiosInstance.post(
      `https://med-scope1.runasp.net/api/doctor/patients/${patientId}/notes`,
      noteData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// ================= UPDATE NOTE =================
export const updatePatientNote = async (
  noteId,
  noteData
) => {
  try {
    const response = await axiosInstance.put(
      `https://med-scope1.runasp.net/api/doctor/patients/notes/${noteId}`,
      noteData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};