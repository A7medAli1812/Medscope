public class Doctor
{
    public int Id { get; set; }
    public string UserId { get; set; }

    public string? Specialty { get; set; }
    public string? LicenseNumber { get; set; }

    // 🔗 Foreign Key
    public int HospitalId { get; set; }
    public Hospital Hospital { get; set; }

    public ICollection<Appointment> Appointments { get; set; }

}
