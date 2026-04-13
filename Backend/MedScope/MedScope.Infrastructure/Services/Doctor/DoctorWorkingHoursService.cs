using MedScope.Application.DTOs.Doctor.WorkingHours;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MedScope.Infrastructure.Services.Doctor
{
    public class DoctorWorkingHoursService : IDoctorWorkingHoursService
    {
        private readonly ApplicationDbContext _context;

        public DoctorWorkingHoursService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveWorkingHours(string doctorUserId, SaveWorkingHoursDto dto)
        {
            var doctorId = await _context.Doctors
                .Where(d => d.UserId == doctorUserId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                throw new Exception("Doctor not found");

            var existing = _context.DoctorWorkingHours
                .Where(x => x.DoctorId == doctorId);

            _context.DoctorWorkingHours.RemoveRange(existing);

            foreach (var day in dto.WorkingDays)
            {
                // ✅ نخلي parsing flexible بدل strict
                var fromInput = day.From?.Trim();
                var toInput = day.To?.Trim();

                if (!DateTime.TryParse(fromInput, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedFrom))
                {
                    throw new Exception($"Invalid From time format: {day.From}");
                }

                if (!DateTime.TryParse(toInput, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTo))
                {
                    throw new Exception($"Invalid To time format: {day.To}");
                }

                var entity = new DoctorWorkingHours
                {
                    DoctorId = doctorId,
                    Day = day.Day.Trim().ToLower(),
                    From = parsedFrom.TimeOfDay,
                    To = parsedTo.TimeOfDay,
                    AppointmentDuration = dto.AppointmentDuration
                };

                _context.DoctorWorkingHours.Add(entity);
            }

            await _context.SaveChangesAsync();
        }
    }
}