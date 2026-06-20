using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Domain.Entities
{
    public class HospitalSpecialty
    {
        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; }

        public int SpecialtyId { get; set; }
        public Specialty Specialty { get; set; }
    }
}
