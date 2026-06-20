using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using MedScope.Domain.Enums;

namespace MedScope.Application.DTOs.Patient
{
    public class PatientAppointmentDto
    {
        public int Id { get; set; }

        public string DoctorName { get; set; }

        public string Specialty { get; set; }

        public string HospitalName { get; set; }

        public string VisitType { get; set; }

        public string Date { get; set; }
        public string Time { get; set; }

        public AppointmentStatus Status { get; set; }
        public string DisplayStatus { get; set; } = null!;
    }
}