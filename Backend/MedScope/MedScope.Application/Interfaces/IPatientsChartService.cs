using MedScope.Application.DTOs;

public interface IPatientsChartService
{
    Task<PatientsChartDto> GetPatientsChartAsync(int month, int page);
}
