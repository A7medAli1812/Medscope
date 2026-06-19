using MedScope.Application.DTOs.Hospital;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
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

        public async Task<string> UploadHospitalImageAsync(int hospitalId, IFormFile file)
        {
            var hospital = await _context.Hospitals.FindAsync(hospitalId);
            if (hospital == null)
                throw new Exception("Hospital not found");

            if (file == null || file.Length == 0)
                throw new Exception("Invalid file");

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var folderPath = Path.Combine("wwwroot", "hospital-images");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = "/hospital-images/" + fileName;
            
            hospital.ImageUrl = imageUrl;
            await _context.SaveChangesAsync();

            return imageUrl;
        }
    }
}
