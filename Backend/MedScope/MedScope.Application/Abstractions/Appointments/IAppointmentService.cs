using MedScope.Application.DTOs.Admin;

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
        // ✅ Completed + Pagination + Search + Date Filter
        Task<(List<AdminAppointmentDto> Data, int TotalCount)>
            GetCompletedAppointmentsAsync(
                int hospitalId,
                int page,
                int pageSize,
                string? search,
                DateOnly? date);

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

        Task CompleteAppointmentAsync(
            int appointmentId,
            int hospitalId
        );
    }
}