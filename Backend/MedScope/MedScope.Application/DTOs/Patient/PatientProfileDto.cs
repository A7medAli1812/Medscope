using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class PatientProfileDto
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public string BloodGroup { get; set; }

        public int PatientId { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string AccountStatus { get; set; }

        public DateTime? LastLogin { get; set; }

        public bool EmailNotifications { get; set; }

        public bool AppointmentReminders { get; set; }

        
    }
}
