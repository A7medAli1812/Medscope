namespace MedScope.Domain.Entities
{
    public class MedicalRecord : AuditableEntity
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public string Diagnosis { get; set; } = null!;
        public string Treatment { get; set; } = null!;
        public string? Notes { get; set; }

        public DateTime RecordDate { get; set; }
    }
}
