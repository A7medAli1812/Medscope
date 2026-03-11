using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.MedicalHistory
{
    public class PatientVisitDto
    {
        public DateTime Date { get; set; }

        public string Diagnosis { get; set; } = null!;

        public string TreatmentPlan { get; set; } = null!;

        public string FollowUp { get; set; } = null!;
    }
}
