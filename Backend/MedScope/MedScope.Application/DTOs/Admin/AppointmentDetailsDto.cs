namespace MedScope.Application.DTOs.Admin
{
    public class AppointmentDetailsDto
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }

        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }

        public int PatientAge { get; set; }
        public string VisitType { get; set; }
        public string? Notes { get; set; }
    }
}

