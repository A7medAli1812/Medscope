using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Domain.Entities
{
    public class BookingSession
    {
        public int Id { get; set; }
        public int PatientId { get; set; }

        public int DoctorId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
    }
}
