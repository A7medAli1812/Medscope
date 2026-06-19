using MedScope.Application.DTOs.Hospital;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services
{
    /// <summary>
    /// Implements hospital queries against EF Core.
    /// Uses projection to avoid over-fetching data.
    /// </summary>
    public class HospitalService : IHospitalService
    {
        private readonly ApplicationDbContext _context;

        public HospitalService(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🏠 HOME PAGE HOSPITALS
        // =========================
        public async Task<List<HomeHospitalDto>> GetHomeHospitalsAsync()
        {
            // Hospital already has a global query filter: WHERE IsDeleted = 0
            // We additionally filter out inactive hospitals.
            var hospitals = await _context.Hospitals
                .Where(h => h.IsActive)
                .Select(h => new HomeHospitalDto
                {
                    Id       = h.Id,
                    Name     = h.Name,
                    // Combine Address + City into a single readable location string
                    Location = (h.Address + ", " + h.City).Trim(' ', ','),
                    ImageUrl = h.ImageUrl
                })
                .ToListAsync();

            return hospitals;
        }
    }
}
