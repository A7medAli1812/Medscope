using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Doctor
{
    public class UpdateDoctorDto
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Specialty { get; set; }

        public string Gender { get; set; }

        public string Status { get; set; }
    }
}
