public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(int month, int? day);
}