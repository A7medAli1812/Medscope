using System.ComponentModel.DataAnnotations;
namespace MedScope.Application.DTOs.SuperAdmin
{
    public class CreateHospitalDto
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Type { get; set; } = null!;

        [Required]
        public int HospitalNumber { get; set; }

        [Required]
        public string Phone { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Website { get; set; } = null!;

        [Required] 
        public string City { get; set; }

        [Required] 
        public string Address { get; set; }
    }
}