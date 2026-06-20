using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class DoctorSlotDto
    {
        public DateOnly Date { get; set; }

        public List<string> AvailableTimes { get; set; } = new(); 
    }
}
