public class Appointment : AuditableEntity
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }

    public int PatientAge { get; set; }      // ✅ إضافة
    public string VisitType { get; set; }
    public string? Notes { get; set; }        // ✅ إضافة

    public AppointmentStatus Status { get; set; }

    // Relations
    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; }
    public int HospitalId { get; set; }
    public Hospital Hospital { get; set; } = null!;

}

