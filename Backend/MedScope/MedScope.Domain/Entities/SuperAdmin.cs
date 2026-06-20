namespace MedScope.Domain.Entities
{
    public class SuperAdmin : AuditableEntity
    {
        public int Id { get; set; }

        public string UserId { get; set; }

    }
}