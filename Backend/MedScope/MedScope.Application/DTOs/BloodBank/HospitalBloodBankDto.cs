using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.BloodBank
{
    public class HospitalBloodBankDto
    {
        public int HospitalId { get; set; }

        public string HospitalName { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public List<BloodBankDto> BloodTypes { get; set; } = new();
    }
}
