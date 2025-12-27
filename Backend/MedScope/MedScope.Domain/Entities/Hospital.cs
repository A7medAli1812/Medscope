using MedScope.Domain.Entities;

public class Hospital
{
    public int Id { get; set; }   
    public string Name { get; set; }
    public string Type { get; set; }
    public int HospitalNumber { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Website { get; set; }

    public ICollection<Doctor> Doctors { get; set; }
    public ICollection<Admin> Admins { get; set; }
}
