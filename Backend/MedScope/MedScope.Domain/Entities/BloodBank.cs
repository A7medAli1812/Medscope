namespace MedScope.Domain.Entities
{
    public class BloodBank : AuditableEntity
    {
        public string BloodType { get; set; } = null!;
        public int Quantity { get; set; }

        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; } = null!;
    }
}
