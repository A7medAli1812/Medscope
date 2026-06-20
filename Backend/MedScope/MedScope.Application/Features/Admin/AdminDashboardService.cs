using MedScope.Application.Abstractions.Admin;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.Admin
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IApplicationDbContext _context;

        public AdminDashboardService(IApplicationDbContext context)
        {
            _context = context;
        }

        public Task<AdminDashboardSummaryDto> GetSummaryAsync(int hospitalNumber)
        {
            // 🔥 الحل هنا: استخدمي Id بدل HospitalNumber
            var hospital = _context.Hospitals
                .FirstOrDefault(h => h.Id == hospitalNumber);

            if (hospital == null)
                throw new Exception("Hospital not found");

            var doctorsCount = _context.Doctors
     .Count(d => d.HospitalId == hospital.Id && !d.IsDeleted);

            var specialties = _context.Doctors
           .Include(d => d.Specialty)
           .Where(d => d.HospitalId == hospital.Id && !d.IsDeleted)
           .Select(d => d.Specialty.Name)
           .Distinct()
           .ToList();

            var departmentsCount = specialties.Count;

            var summary = new AdminDashboardSummaryDto
            {
                HospitalName = hospital.Name,
                HospitalType = hospital.Type,
                DoctorsCount = doctorsCount,
                Phone = hospital.Phone,
                Email = hospital.Email,
                Website = hospital.Website,
                Specialties = specialties,
                DepartmentsCount = departmentsCount
            };

            return Task.FromResult(summary);
        }
    }
}