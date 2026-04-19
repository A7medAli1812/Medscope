using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class ConfirmAppointmentDto
    {
        public string AppointmentNotes { get; set; }
        public string VisitType { get; set; }
    }
}
