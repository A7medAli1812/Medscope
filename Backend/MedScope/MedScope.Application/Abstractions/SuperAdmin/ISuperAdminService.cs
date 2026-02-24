using MedScope.Application.DTOs.SuperAdmin;

namespace MedScope.Application.Abstractions.SuperAdmin
{
    public interface ISuperAdminService
    {
        Task CreateHospitalAsync(CreateHospitalDto dto);
    }
}