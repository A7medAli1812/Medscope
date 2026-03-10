using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class DoctorForBookingDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Specialty { get; set; }

        public string HospitalName { get; set; }
    }
}
