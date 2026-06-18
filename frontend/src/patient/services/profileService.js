// src/patient/services/profileService.js
import axiosInstance from '../../api/axiosInstance';

// ── API Response Shape (from GET /api/patient/profile) ────────────────────────
// {
//   fullName: "John Doe",          ← single field, NOT firstName / lastName
//   email: "john@example.com",
//   phoneNumber: "+201234567890",
//   address: "Cairo",
//   bloodGroup: "A+",
//   patientId: 19,
//   accountStatus: "Active",
//   registrationDate: "2026-03-22T14:42:08.5957878",  ← ISO string
//   lastLogin: null,                                    ← may be missing
//   emailNotifications: true,      ← top-level, NOT nested
//   smsNotifications: false,
//   appointmentReminders: true,
// }

/**
 * Formats an ISO date string into a human-readable date.
 * Returns null if the input is falsy.
 */
const formatDate = (isoString) => {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
};

/**
 * Converts the raw backend API response into a clean, consistent
 * frontend data shape. Called by every service method so all consumers
 * (Profile page, PatientContext, etc.) always get the same structure.
 */
export const normalizeProfile = (raw) => {
  const nameParts = (raw.fullName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    // Identity
    firstName,
    lastName,
    fullName: raw.fullName || '',
    email: raw.email || '',
    phoneNumber: raw.phoneNumber || '',
    address: raw.address || '',
    bloodGroup: raw.bloodGroup || '',

    // Account
    patientId: raw.patientId ?? null,
    accountStatus: raw.accountStatus || 'Active',
    registrationDate: formatDate(raw.registrationDate),
    lastLogin: formatDate(raw.lastLogin),

    // Notifications — the API returns these as top-level booleans
    notifications: {
      emailNotifications: raw.emailNotifications ?? true,
      smsNotifications: raw.smsNotifications ?? false,
      appointmentReminders: raw.appointmentReminders ?? true,
    },
  };
};

// ── Service Methods ────────────────────────────────────────────────────────────

const profileService = {
  /**
   * Fetch the current patient's profile.
   * Returns a normalized frontend-friendly object.
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/patient/profile');
    return normalizeProfile(response.data);
  },

  /**
   * Update editable profile fields.
   * Payload: { firstName, lastName, phoneNumber, address, bloodGroup }
   * Returns the updated normalized profile.
   */
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/patient/profile', data);
    // Some backends echo back the updated object; normalize if present,
    // otherwise the caller re-fetches via getProfile().
    return response.data ? normalizeProfile(response.data) : null;
  },

  /**
   * Update notification preferences.
   * Payload: partial { emailNotifications, smsNotifications, appointmentReminders }
   */
  updateNotifications: async (data) => {
    const response = await axiosInstance.put('/patient/profile/notifications', data);
    return response.data || null;
  },

  /**
   * Change the account password.
   * Payload: { oldPassword, newPassword, confirmPassword }
   */
  changePassword: async (data) => {
    const response = await axiosInstance.put('/patient/profile/change-password', data);
    return response.data || null;
  },

  /**
   * Permanently delete the account.
   * Caller is responsible for clearing storage and redirecting.
   */
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/patient/profile/account');
    return response.data || null;
  },
};

export default profileService;