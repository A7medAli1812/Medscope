using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Admin;
using MedScope.Domain.Entities;
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

        // ✅ القديم — سيبيه زي ما هو
        public async Task<List<AdminAppointmentDto>> GetNewAppointmentsAsync()
        {
            var query =
                from a in _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)

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

                    PatientAge = a.PatientAge, // ✅ من Appointment

                    DoctorName =
                        doctorUser.FirstName + " " + doctorUser.LastName
                };

            return await query.ToListAsync();
        }


        // 🆕 الجديد — Create Appointment
        public async Task<int> CreateAppointmentAsync(CreateAppointmentDto dto)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);
            if (!patientExists)
                throw new Exception("Patient not found");

            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId);
            if (!doctorExists)
                throw new Exception("Doctor not found");

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                Date = DateOnly.FromDateTime(dto.Date),
                Time = TimeOnly.Parse(dto.Time),


                PatientAge = dto.PatientAge,
                VisitType = dto.VisitType,
                Notes = dto.Notes,
                Status = AppointmentStatus.New
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment.Id;
        }
        //Cancel Appointment 
        public async Task CancelAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.Status = AppointmentStatus.Cancelled;

            await _context.SaveChangesAsync();
        }

        //RescheduleAppointment
        public async Task RescheduleAppointmentAsync(
    int appointmentId,
    RescheduleAppointmentDto dto)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.DoctorId = dto.DoctorId;
            appointment.Date = DateOnly.FromDateTime(dto.Date);
            appointment.Time = TimeOnly.Parse(dto.Time);
            appointment.PatientAge = dto.PatientAge;
            appointment.VisitType = dto.VisitType;
            appointment.Notes = dto.Notes;

            // بيرجع New علشان يفضل ظاهر في New Appointments
            appointment.Status = AppointmentStatus.New;

            await _context.SaveChangesAsync();
        }


    }
}

