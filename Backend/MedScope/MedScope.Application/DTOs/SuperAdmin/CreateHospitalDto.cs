namespace MedScope.Application.DTOs.SuperAdmin
{
    public class CreateHospitalDto
    {
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int HospitalNumber { get; set; }
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Website { get; set; } = null!;
    }
}