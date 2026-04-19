using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class AppointmentReviewDto
    {
        // =========================
        // Patient Data
        // =========================
        public string PatientName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        // =========================
        // Doctor Data
        // =========================
        public string DoctorName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string HospitalName { get; set; } = string.Empty;

        // =========================
        // Appointment Data
        // =========================
        public string Date { get; set; } = string.Empty;   // 👈 غيرناها string
        public string Time { get; set; } = string.Empty;   // 👈 عشان AM/PM
    }
}
