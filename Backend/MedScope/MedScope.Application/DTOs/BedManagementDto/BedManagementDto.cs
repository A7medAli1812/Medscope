using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.BedManagementDto
{
    public class BedManagementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int TotalBeds { get; set; }
        public int AvailableBeds { get; set; }
    }
}
