// src/patient/services/appointmentService.js
import axiosInstance from '../../api/axiosInstance';

const BASE = '/patient/appointments';

const appointmentService = {
  // ── Appointments ──────────────────────────────────────────────────────────────

  /** GET /upcoming → list of upcoming appointments */
  getUpcoming: async () => {
    const { data } = await axiosInstance.get(`${BASE}/upcoming`);
    return data;
  },

  /** GET /past → list of past appointments */
  getPast: async () => {
    const { data } = await axiosInstance.get(`${BASE}/past`);
    return data;
  },

  /** PUT /cancel/{id} → cancel an appointment */
  cancelAppointment: async (id) => {
    const { data } = await axiosInstance.put(`${BASE}/cancel/${id}`);
    return data;
  },

  // ── Booking Reference Data ────────────────────────────────────────────────────

  /** GET /hospitals → list of hospitals */
  getHospitals: async () => {
    const { data } = await axiosInstance.get(`${BASE}/hospitals`);
    return data;
  },

  /** GET /specialties -> list of specialties */
  getSpecialties: async (hospitalId) => {
    try {
      const params = {};
      if (hospitalId) params.hospitalId = hospitalId;

      const { data } = await axiosInstance.get(`${BASE}/specialties`, { params });
      console.log('[appointmentService] getSpecialties API response:', data);
      return data;
    } catch (err) {
      console.error('[appointmentService] getSpecialties API error:', err);
      throw err;
    }
  },

  /** GET /doctors → list of doctors */
  getDoctors: async (hospitalId, specialty) => {
    console.log(`[appointmentService] Fetching /doctors?hospitalId=${hospitalId}&specialty=${specialty}`);

    // Prevent sending undefined which can cause 400 Bad Request
    const params = {};
    if (hospitalId) params.hospitalId = hospitalId;
    if (specialty) params.specialty = specialty;

    const { data } = await axiosInstance.get(`${BASE}/doctors`, { params });
    return data;
  },

  /** GET /doctor-schedule/{doctorId} -> time slots for a specific doctor */
  getDoctorSchedule: async (doctorId) => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/doctor-schedule/${doctorId}`);
      console.log('[appointmentService] getDoctorSchedule API response:', data);
      return data;
    } catch (err) {
      console.error('[appointmentService] getDoctorSchedule API error:', err);
      throw err;
    }
  },

  /** GET /booking/available-dates -> returns available dates for a doctor */
  getAvailableDates: async (doctorId) => {
    try {
      const { data } = await axiosInstance.get(`/booking/available-dates`, { params: { doctorId } });
      console.log('[appointmentService] getAvailableDates API response:', data);
      return data;
    } catch (err) {
      console.error('[appointmentService] getAvailableDates API error:', err);
      throw err;
    }
  },

  /** GET /booking/available-slots -> returns available slots for a doctor on a specific date */
  getAvailableSlots: async (doctorId, date) => {
    try {
      const { data } = await axiosInstance.get(`/booking/available-slots`, { params: { doctorId, date } });
      console.log('[appointmentService] getAvailableSlots API response:', data);
      return data;
    } catch (err) {
      console.error('[appointmentService] getAvailableSlots API error:', err);
      throw err;
    }
  },

  /** GET /review → list of reviews */
  getReviews: async () => {
    const { data } = await axiosInstance.get(`${BASE}/review`);
    return data;
  },

  /** GET /booking-form → pre-populated booking form data */
  getBookingFormData: async () => {
    const { data } = await axiosInstance.get(`${BASE}/booking-form`);
    return data;
  },

  // ── Three-Step Booking Flow (per Swagger) ───────────────────────────────────
  //
  //   1. POST /select   → creates server-side booking session
  //   2. GET  /review   → (optional) reads session back for display
  //   3. POST /confirm  → finalises the appointment
  //

  /**
   * Step 1: POST /patient/appointments/select
   * Creates the booking session on the backend.
   * Payload: { doctorId, date, time, appointmentNotes }
   */
  selectAppointment: async (payload) => {
    try {
      console.log('[appointmentService] Step 1 — Select:', payload);
      const { data } = await axiosInstance.post(`${BASE}/select`, payload);
      return data;
    } catch (err) {
      console.error('[appointmentService] selectAppointment error:', err.response?.data || err.message);
      throw err;
    }
  },

  /**
   * Step 2 (optional): GET /patient/appointments/review
   * Returns the current booking session for review.
   */
  reviewAppointment: async () => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/review`);
      return data;
    } catch (err) {
      console.error('[appointmentService] reviewAppointment error:', err.response?.data || err.message);
      throw err;
    }
  },

  /**
   * Step 3: POST /patient/appointments/confirm
   * Confirms the booking session created in Step 1.
   * Payload: { appointmentNotes, visitType }
   */
  confirmAppointment: async (payload) => {
    try {
      console.log('[appointmentService] Step 3 — Confirm:', payload);
      const { data } = await axiosInstance.post(`${BASE}/confirm`, payload);
      return data;
    } catch (err) {
      console.error('[appointmentService] confirmAppointment error:', err.response?.data || err.message);
      throw err;
    }
  },
};

export default appointmentService;
