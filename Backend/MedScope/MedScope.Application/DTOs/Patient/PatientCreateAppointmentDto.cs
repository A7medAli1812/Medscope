using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MedScope.Application.DTOs.Patient
{
    public class PatientCreateAppointmentDto
    {
        public int DoctorId { get; set; }
        public DateOnly Date { get; set; }
        public string Time { get; set; }
        public string? AppointmentNotes { get; set; }
    }
}
