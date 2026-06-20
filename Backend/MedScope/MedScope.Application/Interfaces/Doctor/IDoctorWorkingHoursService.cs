using MedScope.Application.DTOs.Doctor.WorkingHours;

namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorWorkingHoursService
    {
        Task SaveWorkingHours(string doctorUserId, SaveWorkingHoursDto dto);
    }
}