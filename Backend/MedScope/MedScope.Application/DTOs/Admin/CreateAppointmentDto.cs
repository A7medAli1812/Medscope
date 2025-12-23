namespace MedScope.Application.DTOs.Admin
{
    public class CreateAppointmentDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }

        public DateTime Date { get; set; }
        public string Time { get; set; } = null!;

        public int PatientAge { get; set; }

        public string VisitType { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }
}

