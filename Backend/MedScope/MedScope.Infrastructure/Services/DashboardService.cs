using MedScope.Application.DTOs;
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

        // =========================
        // 📊 BASE QUERY
        // =========================
        var baseAppointmentsQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
            select a;

        // =========================
        // 📊 CARDS
        // =========================

        var totalDoctors = await _context.Doctors
            .CountAsync(d => d.HospitalId == hospitalId);

        var totalBeds = await _context.Beds
            .CountAsync(b => b.HospitalId == hospitalId);

        var appointmentsCount = await baseAppointmentsQuery.CountAsync();

        // total patients (distinct)
        var totalPatients = await baseAppointmentsQuery
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync();

        // new patients = عنده حجز واحد بس في المستشفى
        var newPatients = await baseAppointmentsQuery
            .GroupBy(a => a.PatientId)
            .Where(g => g.Count() == 1)
            .CountAsync();

        // =========================
        // 📊 DOCTOR STATS (FILTER BY MONTH / DAY)
        // =========================

        var doctorQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            join u in _context.Users on d.UserId equals u.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
                  && a.Date.Month == month
            select new { a, d, u };

        // filter by day (optional)
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

        // =========================
        // 📦 FINAL RESPONSE
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
}