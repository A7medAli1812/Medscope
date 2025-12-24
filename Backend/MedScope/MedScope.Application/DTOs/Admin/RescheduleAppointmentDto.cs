namespace MedScope.Application.DTOs.Admin
{
    public class RescheduleAppointmentDto
    {
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public int PatientAge { get; set; }
        public string VisitType { get; set; }
        public string? Notes { get; set; }
    }
}

