using MedScope.Application.Common;
namespace MedScope.Application.Interfaces.Doctor;
public interface IDoctorAppointmentService
{
    Task<PaginatedResult<DoctorUpcomingAppointmentsDto>> GetUpcomingAppointmentsAsync(
        int doctorId,
        DateOnly date,
        string view,
        int page);
}