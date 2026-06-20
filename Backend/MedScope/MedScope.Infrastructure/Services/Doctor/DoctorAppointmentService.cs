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

    // ===============================
    // 🔹 Upcoming Appointments
    // ===============================
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
                    from u in userGroup.DefaultIfEmpty()
                    join h in _context.Hospitals on a.HospitalId equals h.Id
                    where a.DoctorId == doctorId
                    select new
                    {
                        a,
                        PatientName = u != null
                            ? (u.FirstName + " " + u.LastName)
                            : "Unknown Patient",
                        HospitalName = h.Name
                    };

        // 🔹 Filtering
        if (view == "day")
        {
            query = query.Where(x => x.a.Date == date);
        }
        else if (view == "week")
        {
            var end = date.AddDays(7);
            query = query.Where(x => x.a.Date >= date && x.a.Date <= end);
        }
        else if (view == "month")
        {
            query = query.Where(x =>
                x.a.Date >= date &&
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
                Time = x.a.Time.ToString("hh:mm tt"),
                Date = x.a.Date.ToString(),
                PatientName = x.PatientName,

                // ✅ من جدول Appointment
                PatientAge = x.a.PatientAge,

                VisitType = x.a.VisitType,
                HospitalName = x.HospitalName
            })
            .ToListAsync();

        return new PaginatedResult<DoctorUpcomingAppointmentsDto>(
    data,
    totalCount,
    page,
    pageSize
);
    }

    // ===============================
    // 🔹 Visit Details
    // ===============================
    public async Task<AppointmentVisitDetailsDto> GetAppointmentVisitDetailsAsync(int appointmentId, int doctorId)
    {
        var result = await (
            from a in _context.Appointments

            join p in _context.Patients on a.PatientId equals p.Id
            join u in _context.Users on p.UserId equals u.Id
            join h in _context.Hospitals on a.HospitalId equals h.Id

            where a.Id == appointmentId && a.DoctorId == doctorId

            select new AppointmentVisitDetailsDto
            {
                AppointmentId = a.Id,

                PatientName = u.FirstName + " " + u.LastName,
                PhoneNumber = u.PhoneNumber,

                // ✅ من جدول Appointment 
                PatientAge = a.PatientAge,

                Date = a.Date.ToString(),
                Time = a.Time.ToString("hh:mm tt"),

                VisitType = a.VisitType.ToString(),
                HospitalName = h.Name
            }
        ).FirstOrDefaultAsync();

        return result;
    }
}