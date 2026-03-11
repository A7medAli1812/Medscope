using MedScope.Application.DTOs.Doctor.WorkingHours;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

            // حذف الإعدادات القديمة
            var existing = _context.DoctorWorkingHours
                .Where(x => x.DoctorId == doctorId);

            _context.DoctorWorkingHours.RemoveRange(existing);

            // إضافة الجديدة
            foreach (var day in dto.WorkingDays)
            {
                var entity = new DoctorWorkingHours
                {
                    DoctorId = doctorId,
                    Day = day.Day,
                    From = day.From.ToTimeSpan(),
                    To = day.To.ToTimeSpan(),
                    AppointmentDuration = dto.AppointmentDuration
                };

                _context.DoctorWorkingHours.Add(entity);
            }

            await _context.SaveChangesAsync();
        }
    }
}