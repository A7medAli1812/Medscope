using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.MedicalHistory
{
    public class PatientMedicalHistoryDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;

        // Counters
        public int ChronicDiseasesCount { get; set; }
        public int SurgeriesCount { get; set; }
        public int MedicationsCount { get; set; }
        public int AllergiesCount { get; set; }

        // Lists
        public List<string> ChronicDiseases { get; set; } = new();
        public List<string> Surgeries { get; set; } = new();
        public List<string> Medications { get; set; } = new();
        public List<string> Allergies { get; set; } = new();

        // Visits History
        public List<PatientVisitDto> Visits { get; set; } = new();
    }
}
