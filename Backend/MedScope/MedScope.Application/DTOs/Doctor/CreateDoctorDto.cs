using MedScope.Domain.Enums;

namespace MedScope.Application.DTOs.Doctor
{
    public class CreateDoctorDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Specialty { get; set; }
        public Gender Gender { get; set; }   // Male / Female
        public string Status { get; set; }   // Active / Inactive
    }
}
