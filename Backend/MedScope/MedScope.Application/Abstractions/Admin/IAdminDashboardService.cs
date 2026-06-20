using MedScope.Application.DTOs.Admin;

namespace MedScope.Application.Abstractions.Admin
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardSummaryDto> GetSummaryAsync(int hospitalId);
    }
}
