using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Domain.Entities
{
    public class DoctorNote
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }

        public DateTime Date { get; set; }

        public string Diagnosis { get; set; }

        public string TreatmentPlan { get; set; }

        public string? FollowUp { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
