
namespace MedScope.Application.Features.SuperAdmin.Reports;
public class ReportsDto
{
    public int TotalPatients { get; set; }
    public int TotalDoctors { get; set; }

    public List<UserGrowthDto> UserGrowth { get; set; }
    public List<HospitalDistributionDto> HospitalDistribution { get; set; }
}

public class UserGrowthDto
{
    public string Date { get; set; }
    public int Patients { get; set; }
    public int Doctors { get; set; }
}

public class HospitalDistributionDto
{
    public string City { get; set; }
    public int Count { get; set; }
}