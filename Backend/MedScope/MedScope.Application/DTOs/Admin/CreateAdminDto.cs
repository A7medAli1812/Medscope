namespace MedScope.Application.DTOs.Admin
{
    public class CreateAdminDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int HospitalId { get; set; }
    }
}
