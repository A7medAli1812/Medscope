public class DoctorUpcomingAppointmentsDto
{
    public int AppointmentId { get; set; }

    public string Time { get; set; }
    public string Date { get; set; }

    public string PatientName { get; set; }
    public int PatientAge { get; set; }

    public string VisitType { get; set; }

    public string HospitalName { get; set; } // 🔥 مهم
}