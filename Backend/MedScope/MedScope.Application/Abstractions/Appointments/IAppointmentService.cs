using MedScope.Application.DTOs.Admin;

namespace MedScope.Application.Abstractions.Appointments
{
    public interface IAppointmentService
    {
        Task<List<AdminAppointmentDto>> GetNewAppointmentsAsync();
    }
}

