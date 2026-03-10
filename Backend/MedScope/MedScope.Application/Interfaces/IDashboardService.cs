using MedScope.Application.DTOs;
using MedScope.Application.DTOs.Patient;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(int month, int? day);

    Task<PatientDashboardDto> GetPatientDashboardAsync(string userId);
}