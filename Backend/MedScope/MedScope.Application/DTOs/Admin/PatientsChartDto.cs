public class PatientsChartDto
{
    public int TotalPatientsCount { get; set; }
    public List<PatientStatsDto> PatientStats { get; set; } = new();
}
