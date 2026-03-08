namespace MedScope.Application.DTOs.Doctor;

public class DoctorPatientRowDto
{
    public int PatientId { get; set; }

    public string FullName { get; set; }

    public int Age { get; set; }

    public string Gender { get; set; }

    public string BloodGroup { get; set; }

    public string PhoneNumber { get; set; }

    public string Email { get; set; }
}