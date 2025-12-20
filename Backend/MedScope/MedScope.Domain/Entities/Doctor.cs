namespace MedScope.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;

        // بيانات الدكتور
        public string? Specialty { get; set; }
        public string? LicenseNumber { get; set; }

        // Navigation

    }
}
