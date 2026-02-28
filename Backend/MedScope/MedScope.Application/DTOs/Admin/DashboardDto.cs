public class DashboardDto
{
    public int TotalBeds { get; set; }
    public int NewPatients { get; set; }
    public int TotalDoctors { get; set; }
    public int AppointmentsCount { get; set; }
    public List<DoctorAppointmentsDto> DoctorStats { get; set; } = new();
}