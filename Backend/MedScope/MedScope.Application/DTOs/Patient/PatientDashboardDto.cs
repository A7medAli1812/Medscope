using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class PatientDashboardDto
    {
        public string PatientName { get; set; }

        public int UpcomingAppointmentsCount { get; set; }

        public int MedicalRecordsCount { get; set; }

        public List<PatientAppointmentDto> UpcomingAppointments { get; set; } = new();

        public List<PatientReportDto> MedicalRecords { get; set; } = new();

        public List<PatientUpdateDto> Updates { get; set; }
    }

   

  
}
