using MedScope.Application.DTOs.Admin;
using MedScope.Application.DTOs.Patient;

namespace MedScope.Application.Abstractions.Appointments
{
    public interface IAppointmentService
    {
        Task<(List<AdminAppointmentDto> Data, int TotalCount)>
            GetNewAppointmentsAsync(
                int hospitalId,
                int page,
                int pageSize,
                string? search,
                DateOnly? date
            );

        // =========================
        // Get Completed Appointments (Admin)
        // =========================
        Task<(List<AdminAppointmentDto> Data, int TotalCount)>
            GetCompletedAppointmentsAsync(
                int hospitalId,
                int page,
                int pageSize,
                string? search,
                DateOnly? date
            );

        // =========================
        // Create Appointment
        // =========================
        Task<int> CreateAppointmentAsync(
            CreateAppointmentDto dto,
            int hospitalId
        );

        // =========================
        // Cancel Appointment (Admin)
        // =========================
        Task CancelAppointmentAsync(
            int appointmentId,
            int hospitalId
        );

        // =========================
        // Reschedule Appointment
        // =========================
        Task RescheduleAppointmentAsync(
            int appointmentId,
            RescheduleDateTimeDto dto,
            int hospitalId
        );

        // =========================
        // Get Appointment Details
        // =========================
        Task<AppointmentDetailsDto> GetAppointmentByIdAsync(
            int appointmentId,
            int hospitalId
        );

        // =========================
        // Complete Appointment
        // =========================
        Task CompleteAppointmentAsync(
            int appointmentId,
            int hospitalId
        );

        // =========================
        // Patient Appointments
        // =========================

        Task<List<PatientAppointmentDto>> GetUpcomingAppointmentsForPatient(int patientId);

        Task<List<PatientAppointmentDto>> GetPastAppointmentsForPatient(int patientId);

        Task CancelAppointmentForPatient(int appointmentId, int patientId);

        Task<List<HospitalForBookingDto>> GetHospitalsForBookingAsync();

        Task<List<string>> GetSpecialtiesAsync();

        Task<List<DoctorForBookingDto>> GetDoctorsBySpecialtyAsync(string specialty, int hospitalId);

        // =========================
        // Get Doctor Available Slots (Booking Step 3)
        // =========================
        Task<DoctorSlotDto> GetDoctorAvailableSlotsAsync(int doctorId, DateOnly date);
        Task<List<DoctorScheduleDto>> GetDoctorScheduleAsync(int doctorId);
        Task<AppointmentReviewDto> GetAppointmentReviewAsync(int doctorId, DateOnly date, TimeOnly time, int patientId);
    }
}