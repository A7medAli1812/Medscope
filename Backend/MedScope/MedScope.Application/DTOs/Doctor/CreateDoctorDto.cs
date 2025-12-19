namespace MedScope.Application.DTOs.Doctor
{
    public class CreateDoctorDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public string Specialty { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
    }
}
