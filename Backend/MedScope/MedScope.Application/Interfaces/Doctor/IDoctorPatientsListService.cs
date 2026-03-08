using MedScope.Application.DTOs.Common;
using MedScope.Application.DTOs.Doctor;

namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorPatientsListService
    {
        Task<PagedResult<DoctorPatientRowDto>> GetDoctorPatients(
            string doctorUserId,
            DoctorPatientsQuery query);
    }
}