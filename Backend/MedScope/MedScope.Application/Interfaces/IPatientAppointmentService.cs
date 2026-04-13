using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MedScope.Application.DTOs.Patient;

namespace MedScope.Application.Interfaces
{
    public interface IPatientAppointmentService
    {
        Task<List<PatientAppointmentDto>> GetUpcomingAppointments(int patientId);

        Task<List<PatientAppointmentDto>> GetPastAppointments(int patientId);

        Task CancelAppointment(int appointmentId);
    }
}
