namespace MedScope.Application.DTOs.Admin
{
    public class UpdateAdminDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Department { get; set; }
        public int HospitalId { get; set; }
        public bool IsActive { get; set; }
    }
}
