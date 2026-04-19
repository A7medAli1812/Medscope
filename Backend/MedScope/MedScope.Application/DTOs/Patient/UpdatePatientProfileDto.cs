using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace MedScope.Application.DTOs.Patient
{


    public class UpdatePatientProfileDto
    {
        [Required(ErrorMessage = "First name is required")]
        [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^01[0-9]{9}$", ErrorMessage = "Invalid phone number (must be Egyptian format)")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [MinLength(5, ErrorMessage = "Address must be at least 5 characters")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid blood group (e.g., A+, O-)")]
        public string BloodGroup { get; set; }
    }
}
