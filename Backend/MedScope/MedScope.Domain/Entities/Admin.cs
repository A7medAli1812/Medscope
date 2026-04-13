namespace MedScope.Domain.Entities
{
    public class Admin
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;
        public string? Department { get; set; }
        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; }
        public bool IsActive { get; set; } = true; // 🔥 مهم
    }
}
