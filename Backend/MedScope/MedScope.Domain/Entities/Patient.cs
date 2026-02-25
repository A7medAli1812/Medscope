public class Patient : AuditableEntity
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public string? BloodGroup { get; set; }
    public bool IsDeleted { get; set; } = false; // 🔥 NEW
}