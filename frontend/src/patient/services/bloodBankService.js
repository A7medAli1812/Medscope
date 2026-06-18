import axiosInstance from '../../api/axiosInstance';

const BASE = '/patient/blood-bank';

/**
 * Normalise a single hospital record coming from the API.
 *
 * API shape:
 *   { hospitalId, hospitalName, address, phone,
 *     bloodTypes: [{ id, bloodType, quantity, status }, …] }
 *
 * UI shape expected by HospitalCard / BloodBank page:
 *   { id, name, address, phone,
 *     bloodTypes: { "A+": 12, "O-": 0, … } }
 */
const normalizeHospital = (raw) => ({
    id: raw.hospitalId,
    name: raw.hospitalName,
    address: raw.address,
    phone: raw.phone,
    bloodTypes: Array.isArray(raw.bloodTypes)
        ? raw.bloodTypes.reduce((map, entry) => {
              map[entry.bloodType] = entry.quantity ?? 0;
              return map;
          }, {})
        : raw.bloodTypes || {},
});

export const getHospitals = async () => {
    try {
        const { data } = await axiosInstance.get(BASE);
        const list = Array.isArray(data) ? data : data?.data || data?.result || [];
        return list.map(normalizeHospital);
    } catch (error) {
        console.error("[BloodBankService] Error fetching blood bank data", error);
        throw error;
    }
};
