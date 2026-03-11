using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Admin;
using MedScope.Application.DTOs.Patient;
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

        // =========================
        // Get New Appointments (Admin)
        // =========================
        public async Task<(List<AdminAppointmentDto> Data, int TotalCount)>
            GetNewAppointmentsAsync(
                int hospitalId,
                int page,
                int pageSize,
                string? search,
                DateOnly? date)
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
                      && a.HospitalId == hospitalId

                select new AdminAppointmentDto
                {
                    AppointmentId = a.Id,
                    Date = a.Date,
                    Time = a.Time,
                    VisitType = a.VisitType,
                    Specialty = null,
                    PatientName = patientUser.FirstName + " " + patientUser.LastName,
                    PatientAge = a.PatientAge,
                    DoctorName = doctorUser.FirstName + " " + doctorUser.LastName
                };

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x =>
                    x.PatientName.Contains(search) ||
                    x.DoctorName.Contains(search));
            }

            if (date.HasValue)
            {
                query = query.Where(x => x.Date == date.Value);
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        // =========================
        // Get Completed Appointments (Admin)
        // =========================
        public async Task<(List<AdminAppointmentDto> Data, int TotalCount)>
            GetCompletedAppointmentsAsync(
                int hospitalId,
                int page,
                int pageSize,
                string? search,
                DateOnly? date)
        {
            var query =
                from a in _context.Appointments
                    .Include(a => a.Patient)
                    .Include(a => a.Doctor)

                join patientUser in _context.Users
                    on a.Patient.UserId equals patientUser.Id

                join doctorUser in _context.Users
                    on a.Doctor.UserId equals doctorUser.Id

                where a.Status == AppointmentStatus.Completed
                      && a.HospitalId == hospitalId

                select new AdminAppointmentDto
                {
                    AppointmentId = a.Id,
                    Date = a.Date,
                    Time = a.Time,
                    PatientName = patientUser.FirstName + " " + patientUser.LastName,
                    PatientAge = a.PatientAge,
                    DoctorName = doctorUser.FirstName + " " + doctorUser.LastName,
                    Specialty = a.Doctor.Specialty
                };

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x =>
                    x.PatientName.Contains(search) ||
                    x.DoctorName.Contains(search));
            }

            if (date.HasValue)
            {
                query = query.Where(x => x.Date == date.Value);
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        // =========================
        // Create Appointment
        // =========================
        public async Task<int> CreateAppointmentAsync(
            CreateAppointmentDto dto,
            int hospitalId)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d =>
                    d.Id == dto.DoctorId &&
                    d.HospitalId == hospitalId);

            if (doctor == null)
                throw new Exception("Doctor does not belong to your hospital");

            var patientExists =
                await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
                throw new Exception("Patient not found");

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                Date = dto.Date,
                Time = TimeOnly.Parse(dto.Time),
                PatientAge = dto.PatientAge,
                VisitType = dto.VisitType,
                Notes = dto.Notes,
                Status = AppointmentStatus.New,
                HospitalId = hospitalId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment.Id;
        }

        // =========================
        // Cancel Appointment (Admin)
        // =========================
        public async Task CancelAppointmentAsync(
            int appointmentId,
            int hospitalId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId &&
                    a.HospitalId == hospitalId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
        }

        // =========================
        // Reschedule Appointment
        // =========================
        public async Task RescheduleAppointmentAsync(
            int appointmentId,
            RescheduleDateTimeDto dto,
            int hospitalId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId &&
                    a.HospitalId == hospitalId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.Date = DateOnly.FromDateTime(dto.Date);
            appointment.Time = TimeOnly.Parse(dto.Time);
            appointment.Status = AppointmentStatus.New;

            await _context.SaveChangesAsync();
        }

        // =========================
        // Complete Appointment
        // =========================
        public async Task CompleteAppointmentAsync(
            int appointmentId,
            int hospitalId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId &&
                    a.HospitalId == hospitalId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.Status = AppointmentStatus.Completed;
            await _context.SaveChangesAsync();
        }

        // =========================
        // Get Appointment Details
        // =========================
        public async Task<AppointmentDetailsDto> GetAppointmentByIdAsync(
            int appointmentId,
            int hospitalId)
        {
            var query =
                from a in _context.Appointments
                    .Include(x => x.Patient)
                    .Include(x => x.Doctor)

                join patientUser in _context.Users
                    on a.Patient.UserId equals patientUser.Id

                join doctorUser in _context.Users
                    on a.Doctor.UserId equals doctorUser.Id

                where a.Id == appointmentId
                      && a.HospitalId == hospitalId

                select new AppointmentDetailsDto
                {
                    AppointmentId = a.Id,
                    PatientId = a.PatientId,
                    PatientName = patientUser.FirstName + " " + patientUser.LastName,
                    DoctorId = a.DoctorId,
                    DoctorName = doctorUser.FirstName + " " + doctorUser.LastName,
                    Date = a.Date,
                    Time = a.Time,
                    PatientAge = a.PatientAge,
                    VisitType = a.VisitType,
                    Notes = a.Notes
                };

            var result = await query.FirstOrDefaultAsync();

            if (result == null)
                throw new Exception("Appointment not found");

            return result;
        }

        // =========================
        // Get Upcoming Appointments (Patient)
        // =========================
        public async Task<List<PatientAppointmentDto>> GetUpcomingAppointmentsForPatient(int patientId)
        {
            var query =
                from a in _context.Appointments
                    .Include(a => a.Doctor)
                    .Include(a => a.Hospital)

                join doctorUser in _context.Users
                    on a.Doctor.UserId equals doctorUser.Id

                where a.PatientId == patientId
                 && a.Status != AppointmentStatus.Cancelled
                 && a.Status != AppointmentStatus.Completed

                select new PatientAppointmentDto
                {
                    Id = a.Id,
                    DoctorName = doctorUser.FirstName + " " + doctorUser.LastName,
                    Specialty = a.Doctor.Specialty,
                    HospitalName = a.Hospital.Name,
                    VisitType = a.VisitType,
                    Date = a.Date.ToDateTime(a.Time),
                    Time = a.Time,
                    Status = a.Status
                };

            return await query
                .OrderBy(x => x.Date)
                .ToListAsync();
        }

        // =========================
        // Get Past Appointments (Patient)
        // =========================
        public async Task<List<PatientAppointmentDto>> GetPastAppointmentsForPatient(int patientId)
        {
            var query =
                from a in _context.Appointments
                    .Include(a => a.Doctor)
                    .Include(a => a.Hospital)

                join doctorUser in _context.Users
                    on a.Doctor.UserId equals doctorUser.Id

                where a.PatientId == patientId
                      && a.Status == AppointmentStatus.Completed

                select new PatientAppointmentDto
                {
                    Id = a.Id,
                    DoctorName = doctorUser.FirstName + " " + doctorUser.LastName,
                    Specialty = a.Doctor.Specialty,
                    HospitalName = a.Hospital.Name,
                    VisitType = a.VisitType,
                    Date = a.Date.ToDateTime(a.Time),
                    Time = a.Time,
                    Status = a.Status
                };

            return await query
                .OrderByDescending(x => x.Date)
                .ToListAsync();
        }

        // =========================
        // Cancel Appointment (Patient)
        // =========================
        public async Task CancelAppointmentForPatient(int appointmentId, int patientId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId &&
                    a.PatientId == patientId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            if (appointment.Status == AppointmentStatus.Completed)
                throw new Exception("Completed appointment cannot be cancelled");

            appointment.Status = AppointmentStatus.Cancelled;

            await _context.SaveChangesAsync();
        }

  

        public async Task<List<HospitalForBookingDto>> GetHospitalsForBookingAsync()
        {
            return await _context.Hospitals
                .Select(h => new HospitalForBookingDto
                {
                    Id = h.Id,
                    Name = h.Name,
                   
                })
                .OrderBy(h => h.Name)
                .ToListAsync();
        }

        // =========================
        // Get Specialties (Booking Step 1)
        // =========================
        public async Task<List<string>> GetSpecialtiesAsync()
        {
            return await _context.Doctors
                .Where(d => !string.IsNullOrEmpty(d.Specialty))
                .Select(d => d.Specialty)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
        }

        public async Task<List<DoctorForBookingDto>> GetDoctorsBySpecialtyAsync(string specialty, int hospitalId)
        {
            var query =
                from d in _context.Doctors
                    .Include(d => d.Hospital)

                join doctorUser in _context.Users
                    on d.UserId equals doctorUser.Id

                where d.Specialty == specialty
                      && d.HospitalId == hospitalId

                select new DoctorForBookingDto
                {
                    Id = d.Id,
                    Name = doctorUser.FirstName + " " + doctorUser.LastName,
                    Specialty = d.Specialty,
                    HospitalName = d.Hospital.Name
                };

            return await query
                .OrderBy(d => d.Name)
                .ToListAsync();
        }
        // =========================
        // Get Doctor Available Slots (Booking Step 3)
        // =========================
        public async Task<DoctorSlotDto> GetDoctorAvailableSlotsAsync(int doctorId, DateOnly date)
        {
            // المواعيد المحجوزة بالفعل
            var bookedTimes = await _context.Appointments
                .Where(a => a.DoctorId == doctorId
                    && a.Date == date
                    && a.Status != AppointmentStatus.Cancelled)
                .Select(a => a.Time)
                .ToListAsync();

            // كل المواعيد الممكنة (كل 30 دقيقة)
            var allSlots = new List<TimeOnly>
    {
                     new TimeOnly(9,0),
                     new TimeOnly(9,30),
                     new TimeOnly(10,0),
                     new TimeOnly(10,30),
                     new TimeOnly(11,0),
                    new TimeOnly(11,30)
    };

            // إزالة المواعيد المحجوزة
            var availableSlots = allSlots
                .Where(t => !bookedTimes.Contains(t))
                .ToList();

            return new DoctorSlotDto
            {
                Date = date,
                AvailableTimes = availableSlots
            };
        }
    }
}