using MedScope.Application.DTOs.Admin;

namespace MedScope.Application.Abstractions.Appointments
{
    public interface IAppointmentService
    {
        Task<List<AdminAppointmentDto>> GetNewAppointmentsAsync(int hospitalId);

        Task<int> CreateAppointmentAsync(
            CreateAppointmentDto dto,
            int hospitalId
        );

        Task CancelAppointmentAsync(
            int appointmentId,
            int hospitalId
        );

        Task RescheduleAppointmentAsync(
            int appointmentId,
            RescheduleDateTimeDto dto,
            int hospitalId
        );

        Task<AppointmentDetailsDto> GetAppointmentByIdAsync(
            int appointmentId,
            int hospitalId
        );
    }
}
