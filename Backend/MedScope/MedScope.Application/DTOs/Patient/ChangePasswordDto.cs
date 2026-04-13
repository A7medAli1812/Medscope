using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }
    }
}
