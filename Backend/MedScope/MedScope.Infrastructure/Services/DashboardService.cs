using MedScope.Application.DTOs;
using MedScope.Application.DTOs.Patient;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DashboardService(
        ApplicationDbContext context,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    // =========================
    // 🏥 ADMIN DASHBOARD
    // =========================
    public async Task<DashboardDto> GetDashboardAsync(int month, int? day)
    {
        var userId = _httpContextAccessor.HttpContext.User
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            throw new Exception("Unauthorized");

        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (admin == null)
            throw new Exception("Admin not found");

        var hospitalId = admin.HospitalId;

        // =========================
        // 📊 Base Query
        // =========================
        var baseAppointmentsQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
                  && !d.IsDeleted
            select a;

        var totalDoctors = await _context.Doctors
            .CountAsync(d => d.HospitalId == hospitalId && !d.IsDeleted);

        var totalBeds = await _context.Beds
           .Where(b => b.HospitalId == hospitalId)
            .SumAsync(b => b.TotalBeds);

        var appointmentsCount = await baseAppointmentsQuery.CountAsync();

        var totalPatients = await baseAppointmentsQuery
            .Where(a => a.PatientId != null)
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync();

        var newPatients = await baseAppointmentsQuery
            .Where(a => a.PatientId != null)
            .GroupBy(a => a.PatientId)
            .Where(g => g.Count() == 1)
            .CountAsync();

        // =========================
        // 👨‍⚕️ Doctors Stats
        // =========================
        var doctorQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
                  && !d.IsDeleted
                  && a.Date.Month == month
            select new
            {
                a.Date,
                d.Id,
                d.UserId
            };

        if (day.HasValue)
        {
            doctorQuery = doctorQuery
                .Where(x => x.Date.Day == day.Value);
        }

        var doctorDataRaw = await doctorQuery.ToListAsync();

        // =========================
        // 👤 Get Users safely
        // =========================
        var userIds = doctorDataRaw
            .Where(x => !string.IsNullOrEmpty(x.UserId))
            .Select(x => x.UserId)
            .Distinct()
            .ToList();

        var users = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        // =========================
        // 📈 Final Doctor Data
        // =========================
        var doctorData = doctorDataRaw
            .GroupBy(x => x.Id)
            .Select(g =>
            {
                var userIdKey = g.First().UserId;

                string doctorName = "Unknown";

                if (!string.IsNullOrEmpty(userIdKey) && users.ContainsKey(userIdKey))
                {
                    var user = users[userIdKey];

                    doctorName = string.Join(" ",
                        new[] { user.FirstName ?? "", user.LastName ?? "" }
                        .Where(s => !string.IsNullOrWhiteSpace(s)));
                }

                return new
                {
                    DoctorId = g.Key,
                    DoctorName = doctorName,
                    Count = g.Count()
                };
            })
            .ToList();

        var totalAppointmentsForDoctors = doctorData.Sum(x => x.Count);

        var doctorStats = doctorData
            .Select(x => new DoctorAppointmentsDto
            {
                DoctorName = x.DoctorName + $" (ID:{x.DoctorId})",
                Count = totalAppointmentsForDoctors == 0
                    ? 0
                    : (int)Math.Round((double)x.Count / totalAppointmentsForDoctors * 100)
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        // =========================
        // 📦 Final Response
        // =========================
        return new DashboardDto
        {
            TotalBeds = totalBeds,
            TotalDoctors = totalDoctors,
            AppointmentsCount = appointmentsCount,
            NewPatients = newPatients,
            DoctorStats = doctorStats
        };
    }

    // =========================
    // 👤 PATIENT DASHBOARD
    // =========================
    public async Task<PatientDashboardDto> GetPatientDashboardAsync(string userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception("User not found");

        int patientId = await _context.Patients
            .Where(p => p.UserId == userId)
            .Select(p => p.Id)
            .FirstOrDefaultAsync();

        // =========================
        // Upcoming Appointments
        // =========================
        var appointments = await (
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            join u in _context.Users on d.UserId equals u.Id
            where a.PatientId == patientId
                  && !d.IsDeleted
                  && a.Date >= DateOnly.FromDateTime(DateTime.Now)
            orderby a.Date
            select new PatientAppointmentDto
            {
                DoctorName = u.FirstName + " " + u.LastName,
                Specialty = d.Specialty.Name,

                Date = a.Date.ToString("yyyy-MM-dd"),     
                Time = a.Time.ToString("hh:mm tt"),       

                Status = a.Status
            })
            .Take(3)
            .ToListAsync();

        // =========================
        // Medical Records (Doctor Notes)
        // =========================
        var data = await _context.DoctorNotes
      .Where(n => n.PatientId == patientId)
      .OrderByDescending(n => n.CreatedAt)
      .Take(3)
      .ToListAsync();

        var records = data.Select(n => new PatientReportDto
        {
            Title = n.Diagnosis, // أو Notes لو عايزة
            Date = n.CreatedAt.ToString("yyyy-MM-dd"),
            Status = "Ready"
        }).ToList();

        // =========================
        // Updates
        // =========================
        var updates = new List<PatientUpdateDto>();

        foreach (var appt in appointments)
        {
            if (DateTime.TryParse(appt.Date, out DateTime apptDate))
            {
                var daysUntil = (apptDate.Date - DateTime.Now.Date).Days;
                string timeString = string.Empty;

                if (daysUntil == 0) timeString = "Today";
                else if (daysUntil == 1) timeString = "Tomorrow";
                else if (daysUntil > 1 && daysUntil <= 7) timeString = $"In {daysUntil} days";
                else if (daysUntil > 7) timeString = apptDate.ToString("MMM dd, yyyy");

                if (!string.IsNullOrEmpty(timeString))
                {
                    updates.Add(new PatientUpdateDto
                    {
                        Message = $"Appointment reminder with Dr. {appt.DoctorName}",
                        Time = timeString
                    });
                }
            }
        }

        foreach (var note in data)
        {
            var timeSpan = DateTime.UtcNow - note.CreatedAt;
            string timeString;

            if (timeSpan.TotalMinutes < 1)
                timeString = "Just now";
            else if (timeSpan.TotalMinutes < 60)
                timeString = $"{(int)timeSpan.TotalMinutes} mins ago";
            else if (timeSpan.TotalHours < 2)
                timeString = "1 hour ago";
            else if (timeSpan.TotalHours < 24)
                timeString = $"{(int)timeSpan.TotalHours} hours ago";
            else if (timeSpan.TotalDays < 2)
                timeString = "1 day ago";
            else
                timeString = $"{(int)timeSpan.TotalDays} days ago";

            var title = !string.IsNullOrEmpty(note.Diagnosis) ? note.Diagnosis : "Medical record";

            updates.Add(new PatientUpdateDto
            {
                Message = $"New doctor note added: {title}",
                Time = timeString
            });
        }

        return new PatientDashboardDto
        {
            PatientName = user.FirstName + " " + user.LastName,

            UpcomingAppointmentsCount = appointments.Count,
            MedicalRecordsCount = records.Count,

            UpcomingAppointments = appointments,
            MedicalRecords = records,

            Updates = updates
        };
    }
}