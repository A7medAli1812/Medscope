using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Admin;
using MedScope.Domain.Enums;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace MedScope.Infrastructure.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;

        public AppointmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AdminAppointmentDto>> GetNewAppointmentsAsync()
        {
            var query =
                from a in _context.Appointments
                    .Include(x => x.Patient)
                    .Include(x => x.Doctor)

                join patientUser in _context.Users
                    on a.Patient.UserId equals patientUser.Id

                join doctorUser in _context.Users
                    on a.Doctor.UserId equals doctorUser.Id

                where a.Status == AppointmentStatus.New

                select new AdminAppointmentDto
                {
                    AppointmentId = a.Id,
                    Date = a.Date,
                    Time = a.Time,
                    VisitType = a.VisitType,

                    PatientName =
                        patientUser.FirstName + " " + patientUser.LastName,

                    PatientAge =
                        DateTime.Now.Year - patientUser.DateOfBirth.Year,

                    DoctorName =
                        doctorUser.FirstName + " " + doctorUser.LastName
                };

            return await query.ToListAsync();
        }
    }
}

