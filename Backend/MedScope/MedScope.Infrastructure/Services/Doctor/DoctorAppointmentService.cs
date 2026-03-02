using MedScope.Application.Common;
using MedScope.Application.DTOs.Doctor;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class DoctorAppointmentService : IDoctorAppointmentService
{
    private readonly ApplicationDbContext _context;

    public DoctorAppointmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<DoctorUpcomingAppointmentsDto>> GetUpcomingAppointmentsAsync(
        int doctorId,
        DateOnly date,
        string view,
        int page)
    {
        int pageSize = 10;

        var query = from a in _context.Appointments
                    join p in _context.Patients on a.PatientId equals p.Id
                    join u in _context.Users on p.UserId equals u.Id into userGroup
                    from u in userGroup.DefaultIfEmpty() // 👈 حل null
                    join h in _context.Hospitals on a.HospitalId equals h.Id
                    where a.DoctorId == doctorId
                    select new
                    {
                        a,
                        PatientName = u != null
                            ? (u.FirstName + " " + u.LastName)
                            : "Unknown Patient", // 👈 fallback
                        HospitalName = h.Name
                    };

        // 🔹 Filtering
        if (view == "day")
        {
            query = query.Where(x => x.a.Date == date);
        }
        else if (view == "week")
        {
            var start = date.AddDays(-(int)date.DayOfWeek);
            var end = start.AddDays(6);

            query = query.Where(x => x.a.Date >= start && x.a.Date <= end);
        }
        else if (view == "month")
        {
            query = query.Where(x =>
                x.a.Date.Month == date.Month &&
                x.a.Date.Year == date.Year);
        }

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderBy(x => x.a.Date)
            .ThenBy(x => x.a.Time)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DoctorUpcomingAppointmentsDto
            {
                AppointmentId = x.a.Id,
                Time = x.a.Time.ToString(),
                Date = x.a.Date.ToString(),
                PatientName = x.PatientName,
                PatientAge = x.a.PatientAge,
                VisitType = x.a.VisitType,
                HospitalName = x.HospitalName
            })
            .ToListAsync();

        return new PaginatedResult<DoctorUpcomingAppointmentsDto>
        {
            Data = data,
            CurrentPage = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}