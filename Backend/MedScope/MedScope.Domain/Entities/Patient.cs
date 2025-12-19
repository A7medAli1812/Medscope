using MedScope.Domain.Enums;

namespace MedScope.Domain.Entities
{
    public class Patient : AuditableEntity
    {
        public string UserId { get; set; }   // ⬅ مهم لربط المريض باليوزر


    }
}
