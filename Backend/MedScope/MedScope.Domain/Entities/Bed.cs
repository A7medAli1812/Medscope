namespace MedScope.Domain.Entities
{
    public class Bed : AuditableEntity
    {
        public string BedNumber { get; set; } = null!;
        public string Ward { get; set; } = null!;
        public bool IsOccupied { get; set; }

        public int? PatientId { get; set; }
        public Patient? Patient { get; set; }
<<<<<<< HEAD

=======
>>>>>>> origin/Backend-yousef
        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; } = null!;


<<<<<<< HEAD

=======
>>>>>>> origin/Backend-yousef
    }
}
