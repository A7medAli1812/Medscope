public class Patient : AuditableEntity
{
    public int Id { get; set; }
    public string UserId { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
}


