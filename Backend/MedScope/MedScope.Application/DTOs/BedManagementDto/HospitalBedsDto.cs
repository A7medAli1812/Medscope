using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.BedManagementDto
{
    public class HospitalBedsDto
    {
        public string HospitalName { get; set; } = null!;

        public List<BedManagementDto> Beds { get; set; } = new();
    }
}
