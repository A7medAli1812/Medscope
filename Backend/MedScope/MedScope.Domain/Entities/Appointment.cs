using MedScope.Domain.Entities;

public class Appointment : AuditableEntity
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }

    public string VisitType { get; set; }
    public AppointmentStatus Status { get; set; }

    // Relations
    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; }
}
