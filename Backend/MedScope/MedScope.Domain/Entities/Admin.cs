namespace MedScope.Domain.Entities
{
    public class Admin
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;

        // بيانات إضافية
        public string? Department { get; set; }
    }
}
