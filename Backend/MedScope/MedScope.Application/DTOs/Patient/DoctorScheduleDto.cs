using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class DoctorScheduleDto
    {
        public string Day { get; set; }

        public TimeOnly From { get; set; }

        public TimeOnly To { get; set; }
    }
}
