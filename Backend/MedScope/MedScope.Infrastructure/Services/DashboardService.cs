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

        if (userId == null)
            throw new Exception("Unauthorized");

        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (admin == null)
            throw new Exception("Admin not found");

        var hospitalId = admin.HospitalId;

        var baseAppointmentsQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
                  && !d.IsDeleted
            select a;

        // ✅ تعديل هنا (Soft Delete)
        var totalDoctors = await _context.Doctors
            .CountAsync(d => d.HospitalId == hospitalId && !d.IsDeleted);

        var totalBeds = await _context.Beds
            .CountAsync(b => b.HospitalId == hospitalId);

        var appointmentsCount = await baseAppointmentsQuery.CountAsync();

        var totalPatients = await baseAppointmentsQuery
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync();

        var newPatients = await baseAppointmentsQuery
            .GroupBy(a => a.PatientId)
            .Where(g => g.Count() == 1)
            .CountAsync();

        var doctorQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            join u in _context.Users on d.UserId equals u.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
                  && !d.IsDeleted
                  && a.Date.Month == month
            select new { a, d, u };

        if (day.HasValue)
        {
            doctorQuery = doctorQuery
                .Where(x => x.a.Date.Day == day.Value);
        }

        var doctorData = await doctorQuery
            .GroupBy(x => new
            {
                x.d.Id,
                x.u.FirstName,
                x.u.LastName
            })
            .Select(g => new
            {
                DoctorId = g.Key.Id,
                DoctorName = g.Key.FirstName + " " + g.Key.LastName,
                Count = g.Count()
            })
            .ToListAsync();

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

        return new PatientDashboardDto
        {
            PatientName = user.FirstName + " " + user.LastName,
            UpcomingAppointmentsCount = appointments.Count,
            MedicalReportsCount = 0,
            UpcomingAppointments = appointments,
            MedicalReports = new List<PatientReportDto>()
        };
    }
}