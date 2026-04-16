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
            .CountAsync(b => b.HospitalId == hospitalId);

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
                Specialty = d.Specialty,
                Date = a.Date.ToDateTime(TimeOnly.MinValue),
                Status = a.Status
            })
            .Take(3)
            .ToListAsync();

        // =========================
        // Medical Records (Doctor Notes)
        // =========================
        var records = await _context.MedicalRecords
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RecordDate)
            .Take(3)
            .Select(r => new PatientReportDto
            {
                Title = r.Notes,
                Date = r.RecordDate,
                Status = "Ready"
            })
            .ToListAsync();

        // =========================
        // Updates
        // =========================
        var updates = new List<PatientUpdateDto>();

        if (appointments.Any())
        {
            updates.Add(new PatientUpdateDto
            {
                Message = "Appointment reminder for tomorrow",
                Time = "2 hours ago"
            });
        }

        if (records.Any())
        {
            updates.Add(new PatientUpdateDto
            {
                Message = "New doctor note added",
                Time = "1 day ago"
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