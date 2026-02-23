namespace MedScope.Domain.Entities
{
    public class BloodBank : AuditableEntity
    {
        public string BloodType { get; set; } = null!;
        public int Quantity { get; set; } // عدد أكياس الدم المتوفرة
    }
}
