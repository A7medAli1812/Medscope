using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Patient")]
    public class SpecialtiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpecialtiesController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetSpecialties(int hospitalId)
        {
            // 🔥 هنا الـ handling
            if (hospitalId == 0)
                return BadRequest("hospitalId is required");

            var specialties = await _context.Doctors
                .Include(d => d.Specialty)
                .Where(d => d.HospitalId == hospitalId && !d.IsDeleted)
                .Select(d => new
                {
                    Id = d.Specialty.Id,
                    Name = d.Specialty.Name
                })
                .Distinct()
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(specialties);
        }
    }
}
