using MedScope.Application.Abstractions.Admin;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Admin;

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
            var hospital = _context.Hospitals
                .FirstOrDefault(h => h.HospitalNumber == hospitalNumber);

            if (hospital == null)
                throw new Exception("Hospital not found");

            var doctorsCount = _context.Doctors
            .Count(d => d.HospitalId == hospital.Id);



            var summary = new AdminDashboardSummaryDto
            {
                HospitalName = hospital.Name,
                HospitalType = hospital.Type,
                DoctorsCount = doctorsCount,
                Phone = hospital.Phone,
                Email = hospital.Email,
                Website = hospital.Website
            };

            return Task.FromResult(summary);
        }

    }
}
