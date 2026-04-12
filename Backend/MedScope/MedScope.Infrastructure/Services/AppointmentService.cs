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
            AdminCreateAppointmentDto dto,
    int hospitalId)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d =>
                    d.Id == dto.DoctorId &&
                    d.HospitalId == hospitalId);

            if (doctor == null)
                throw new Exception("Doctor does not belong to your hospital");

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == dto.PatientId);

            if (patient == null)
                throw new Exception("Patient not found");

            // ✅ تعديل 1: تأمين قراءة الوقت
            // if (!TimeOnly.TryParse(dto.Time, out var appointmentTime))
            // throw new Exception("Invalid time format");
            TimeOnly appointmentTime;

            // نحاول الأول AM/PM
            if (DateTime.TryParseExact(
                    dto.Time.ToUpper(),
                    "hh:mm tt",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out var parsedAmPm))
            {
                appointmentTime = TimeOnly.FromDateTime(parsedAmPm);
            }
            // لو مش AM/PM نحاول 24-hour
            else if (TimeOnly.TryParse(dto.Time, out var parsed24))
            {
                appointmentTime = parsed24;
            }
            else
            {
                throw new Exception("Invalid time format. Use 'hh:mm AM/PM' or 'HH:mm'");
            }

            var appointmentDateTime = dto.Date.ToDateTime(appointmentTime);
            // 1️⃣ منع الحجز في الماضي
            if (appointmentDateTime <= DateTime.Now)
                throw new Exception("Cannot book appointment in the past");

            // 2️⃣ منع حجز نفس الموعد مرتين
            var exists = await _context.Appointments
                .AnyAsync(a =>
                    a.DoctorId == dto.DoctorId &&
                  a.Date == dto.Date &&
                    a.Time == appointmentTime &&
                    a.Status != AppointmentStatus.Cancelled);

            if (exists)
                throw new Exception("This time slot is already booked");

            // ✅ تعديل 2: توحيد صيغة اليوم
            var day = dto.Date.DayOfWeek.ToString().ToLower().Trim();

            var workingHours = await _context.DoctorWorkingHours
                .FirstOrDefaultAsync(w =>
                    w.DoctorId == dto.DoctorId &&
                    w.Day.ToLower().Trim() == day);

            if (workingHours == null)
                throw new Exception("Doctor does not work on this day");

            var from = TimeOnly.FromTimeSpan(workingHours.From);
            var to = TimeOnly.FromTimeSpan(workingHours.To);

            // ✅ تعديل 3: validation مضبوط 100%
            if (appointmentTime < from || appointmentTime >= to)
                throw new Exception("Appointment outside doctor working hours");

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                Date = dto.Date,
                Time = appointmentTime,
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
            var day = date.DayOfWeek.ToString();

            var workingHours = await _context.DoctorWorkingHours
                .FirstOrDefaultAsync(w => w.DoctorId == doctorId && w.Day == day);

            if (workingHours == null)
                throw new Exception("Doctor does not work on this day");

            var from = TimeOnly.FromTimeSpan(workingHours.From);
            var to = TimeOnly.FromTimeSpan(workingHours.To);

            var duration = workingHours.AppointmentDuration;

            var allSlots = new List<TimeOnly>();

            var current = from;

            while (current < to)
            {
                allSlots.Add(current);
                current = current.AddMinutes(duration);
            }

            var bookedTimes = await _context.Appointments
                .Where(a =>
                    a.DoctorId == doctorId &&
                    a.Date == date &&
                    a.Status != AppointmentStatus.Cancelled)
                .Select(a => a.Time)
                .ToListAsync();

            var now = DateTime.UtcNow.AddHours(2); // توقيت مصر

            var availableSlots = allSlots
                .Where(t => !bookedTimes.Contains(t))
                .Where(t =>
                {
                    // لو التاريخ مش النهارده → رجع كل المواعيد
                    if (date != DateOnly.FromDateTime(now))
                        return true;

                    // لو النهارده → رجع اللي بعد الوقت الحالي بس
                    var slotDateTime = date.ToDateTime(t);
                    return slotDateTime > now;
                })
                .ToList();

            return new DoctorSlotDto
            {
                Date = date,
                AvailableTimes = availableSlots
            };
        }
        public async Task<List<DoctorScheduleDto>> GetDoctorScheduleAsync(int doctorId)
        {
            return await _context.DoctorWorkingHours
                .Where(w => w.DoctorId == doctorId)
                .Select(w => new DoctorScheduleDto
                {
                    Day = w.Day,
                    From = TimeOnly.FromTimeSpan(w.From),
                    To = TimeOnly.FromTimeSpan(w.To)
                })
                .OrderBy(w => w.Day)
                .ToListAsync();
        }
        public async Task<AppointmentReviewDto> GetAppointmentReviewAsync(int doctorId, DateOnly date, TimeOnly time, int patientId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Hospital)
                .FirstOrDefaultAsync(d => d.Id == doctorId);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (doctor == null || patient == null)
                throw new Exception("Invalid data");

            var doctorUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == doctor.UserId);

            var patientUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == patient.UserId);

            if (doctorUser == null || patientUser == null)
                throw new Exception("User not found");

            return new AppointmentReviewDto
            {
                DoctorName = doctorUser.FirstName + " " + doctorUser.LastName,
                Specialty = doctor.Specialty,
                HospitalName = doctor.Hospital.Name,
                Date = date,
                Time = time
            };
        }
        public async Task<List<DateOnly>> GetDoctorAvailableDatesAsync(int doctorId, int daysAhead = 7)
        {
            // 1️⃣ هات أيام شغل الدكتور
            var workingDays = await _context.DoctorWorkingHours
                .Where(w => w.DoctorId == doctorId)
                .Select(w => w.Day)
                .ToListAsync();

            var availableDates = new List<DateOnly>();

            var today = DateTime.Today;

            // 2️⃣ لف على الأيام الجاية
            for (int i = 0; i < daysAhead; i++)
            {
                var date = DateOnly.FromDateTime(today.AddDays(i));
                var dayName = date.DayOfWeek.ToString();

                // 3️⃣ لو اليوم ده من أيام شغل الدكتور
                if (workingDays.Contains(dayName))
                {
                    availableDates.Add(date);
                }
            }

            return availableDates;
        }
        public async Task<int> CreateAppointmentForPatientAsync(
            string userId,
            PatientCreateAppointmentDto dto)
        {
            // 1️⃣ نجيب patient من user
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                throw new Exception("Patient not found");

            // 2️⃣ نجيب الدكتور
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Id == dto.DoctorId);

            if (doctor == null)
                throw new Exception("Doctor not found");

            // 3️⃣ نحول الوقت
            TimeOnly appointmentTime;

            // نحاول AM/PM
            if (DateTime.TryParseExact(
                    dto.Time.ToUpper(),
                    "hh:mm tt",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out var parsedAmPm))
            {
                appointmentTime = TimeOnly.FromDateTime(parsedAmPm);
            }
            // لو مش AM/PM نحاول 24-hour
            else if (TimeOnly.TryParse(dto.Time, out var parsed24))
            {
                appointmentTime = parsed24;
            }
            else
            {
                throw new Exception("Invalid time format. Use 'hh:mm AM/PM' or 'HH:mm'");
            }

            var appointmentDateTime = dto.Date.ToDateTime(appointmentTime);

            if (appointmentDateTime <= DateTime.Now)
                throw new Exception("Cannot book in the past");

            // 4️⃣ نتأكد إن مش محجوز
            var exists = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.Date == dto.Date &&
                a.Time == appointmentTime &&
                a.Status != AppointmentStatus.Cancelled);

            if (exists)
                throw new Exception("This slot is already booked");

            // 5️⃣ نعمل الحجز
            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                Date = dto.Date,
                Time = appointmentTime,
                Notes = dto.AppointmentNotes,
                Status = AppointmentStatus.New,
                HospitalId = doctor.HospitalId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment.Id;
        }
        public async Task<BookingFormDto> GetBookingFormAsync(string userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            return new BookingFormDto
            {
                PatientName = user.FirstName + " " + user.LastName,
                Phone = user.PhoneNumber,
                Email = user.Email
            };
        }
    }
}