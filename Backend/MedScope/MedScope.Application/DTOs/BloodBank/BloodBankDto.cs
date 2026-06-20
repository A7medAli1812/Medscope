using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.BloodBank
{
    public class BloodBankDto
    {
        public int Id { get; set; }
        public string BloodType { get; set; } = null!;
        public int Quantity { get; set; }
        public string Status { get; set; } = null!;
    }
}
