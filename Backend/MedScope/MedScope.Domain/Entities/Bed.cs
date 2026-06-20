namespace MedScope.Domain.Entities
{
    public class Bed : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public int TotalBeds { get; set; }

        public int AvailableBeds { get; set; }

        public int? PatientId { get; set; }
        public Patient? Patient { get; set; }

        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; } = null!;



    }
}
