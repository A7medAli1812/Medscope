namespace MedScope.Domain.Entities
{
    public class Appointment : AuditableEntity
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = "Pending"; // Pending / Confirmed / Cancelled

        public string? Notes { get; set; }
    }
}
