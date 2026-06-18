import axiosInstance from '../../api/axiosInstance';

const BASE = '/patient/hospital-beds';

/**
 * Normalise a single hospital record coming from the API.
 *
 * API shape:
 *   { hospitalName, beds: [{ id, name, totalBeds, availableBeds }, …] }
 *
 * UI shape expected by MultiHospitalCard:
 *   { id, name, beds: [{ type, occupied, total }, …] }
 */
const normalizeHospital = (raw, index) => ({
    id: raw.id ?? raw.hospitalId ?? index,
    name: raw.hospitalName,
    beds: Array.isArray(raw.beds)
        ? raw.beds.map((bed) => ({
              type: bed.name,
              total: bed.totalBeds ?? 0,
              occupied: (bed.totalBeds ?? 0) - (bed.availableBeds ?? 0),
          }))
        : [],
});

export const getMultiHospitals = async () => {
    try {
        const { data } = await axiosInstance.get(BASE);
        const list = Array.isArray(data) ? data : data?.data || data?.result || [];
        return list.map(normalizeHospital);
    } catch (error) {
        console.error('[MultiHospitalService] Error fetching hospital beds:', error);
        throw error;
    }
};
