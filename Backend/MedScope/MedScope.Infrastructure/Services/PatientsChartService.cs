using MedScope.Application.DTOs;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class PatientsChartService : IPatientsChartService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PatientsChartService(
        ApplicationDbContext context,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PatientsChartDto> GetPatientsChartAsync(int month, int page)
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

        // 🔥 base query
        var baseQuery =
            from a in _context.Appointments
            join d in _context.Doctors on a.DoctorId equals d.Id
            where a.HospitalId == hospitalId
                  && d.HospitalId == hospitalId
            select a;

        // =========================
        // ✅ TOTAL PATIENTS (ثابت)
        // =========================
        var totalPatients = await baseQuery
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync();

        // =========================
        // ✅ First visit لكل مريض
        // =========================
        var firstVisits = await baseQuery
            .GroupBy(a => a.PatientId)
            .Select(g => new
            {
                PatientId = g.Key,
                FirstVisit = g.Min(x => x.Date)
            })
            .ToDictionaryAsync(x => x.PatientId, x => x.FirstVisit);

        // =========================
        // 📅 Pagination (7 days)
        // =========================
        int pageSize = 7;
        int startDay = (page - 1) * pageSize + 1;
        int endDay = startDay + pageSize - 1;

        var daysInMonth = DateTime.DaysInMonth(DateTime.UtcNow.Year, month);

        var patientStats = new List<PatientStatsDto>();

        for (int day = startDay; day <= endDay && day <= daysInMonth; day++)
        {
            var date = new DateOnly(DateTime.UtcNow.Year, month, day);

            var patientsInDay = await baseQuery
                .Where(a => a.Date == date)
                .Select(a => a.PatientId)
                .Distinct()
                .ToListAsync();

            int newCount = 0;
            int oldCount = 0;

            foreach (var patientId in patientsInDay)
            {
                if (firstVisits[patientId] == date)
                    newCount++;
                else
                    oldCount++;
            }

            patientStats.Add(new PatientStatsDto
            {
                Date = date.ToDateTime(TimeOnly.MinValue),
                NewPatients = newCount,
                OldPatients = oldCount
            });
        }

        return new PatientsChartDto
        {
            TotalPatientsCount = totalPatients,
            PatientStats = patientStats
        };
    }
}
