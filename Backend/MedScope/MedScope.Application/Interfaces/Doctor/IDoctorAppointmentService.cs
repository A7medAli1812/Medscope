using MedScope.Application.Common;
using MedScope.Application.DTOs.Doctor;
namespace MedScope.Application.Interfaces.Doctor;
public interface IDoctorAppointmentService
{
    Task<PaginatedResult<DoctorUpcomingAppointmentsDto>> GetUpcomingAppointmentsAsync(
        int doctorId,
        DateOnly date,
        string view,
        int page);

    Task<AppointmentVisitDetailsDto> GetAppointmentVisitDetailsAsync(int appointmentId, int doctorId);
}