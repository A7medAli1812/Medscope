using MedScope.Application.Features.SuperAdmin.Admins;
using MedScope.Application.Features.SuperAdmin.Reports;

public interface IReportService
{
    byte[] GenerateAdminsReport(List<AdminDto> admins);
    byte[] GenerateAdminsExcel(List<AdminDto> admins);

    byte[] GenerateDashboardReport(ReportsDto data);
    byte[] GenerateDashboardExcel(ReportsDto data);
}