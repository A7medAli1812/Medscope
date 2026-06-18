import axiosInstance from '../../api/axiosInstance';
import { mockMedicalHistory } from '../data/mockMedicalHistory';

const BASE = '/patient/medical-history';

export const getMedicalHistory = async () => {
    try {
        const { data } = await axiosInstance.get(BASE);
        const result = data?.data || data?.result || data;

        // If the backend returns no data (e.g. 204 No Content or empty object),
        // we fallback to the mock data so you can still see and test the UI.
        if (!result || Object.keys(result).length === 0) {
            console.warn('[MedicalHistoryService] No data from API, falling back to mock data.');
            return mockMedicalHistory;
        }

        console.log('[MedicalHistoryService] Raw API response:', result);

        // The API returns STRING arrays (e.g. ["Diabetes3"]) — convert to objects
        const toNameObjects = (arr) => {
            if (!Array.isArray(arr)) return [];
            return arr.map(item =>
                typeof item === 'string' ? { name: item } : item
            );
        };

        return {
            patient: {
                name: result.fullName || "-",
                id: result.patientId ?? "-",
                bloodType: result.bloodGroup || "-",
                age: result.age ?? "-",
                gender: result.gender || "-",
                phone: result.phoneNumber || "-",
                email: result.email || "-"
            },
            summary: {
                chronicDiseases: result.chronicDiseasesCount ?? result.chronicDiseases?.length ?? 0,
                surgeries: result.surgeriesCount ?? result.surgeries?.length ?? 0,
                medications: result.medicationsCount ?? result.medications?.length ?? 0,
                allergies: result.allergiesCount ?? result.allergies?.length ?? 0
            },
            history: {
                chronicDiseases: toNameObjects(result.chronicDiseases),
                surgeries: toNameObjects(result.surgeries),
                medications: toNameObjects(result.medications),
                allergies: toNameObjects(result.allergies)
            },
            visits: Array.isArray(result.visits) ? result.visits : []
        };
    } catch (error) {
        console.error('[MedicalHistoryService] Error fetching medical history:', error);
        throw error;
    }
};
