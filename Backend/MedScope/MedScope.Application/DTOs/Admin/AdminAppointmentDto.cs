namespace MedScope.Application.DTOs.Admin
{
    public class AdminAppointmentDto
    {
        public int AppointmentId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public string PatientName { get; set; }
        public int PatientAge { get; set; }
        public string DoctorName { get; set; }
        public string VisitType { get; set; }
    }
}



