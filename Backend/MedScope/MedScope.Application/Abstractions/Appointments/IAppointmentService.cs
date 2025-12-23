using MedScope.Application.DTOs.Admin;

namespace MedScope.Application.Abstractions.Appointments
{
    public interface IAppointmentService
    {
        // existing
        Task<List<AdminAppointmentDto>> GetNewAppointmentsAsync();

        // new - Create Appointment
        Task<int> CreateAppointmentAsync(CreateAppointmentDto dto);
    }
}



