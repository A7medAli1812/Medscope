using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/admin/specialties")]
    [Authorize(Roles = "Admin,Patient")]
    public class SpecialtiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpecialtiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔥 تخصصات المستشفى (للأدمن)
        [HttpGet("by-hospital")]
        public async Task<IActionResult> GetHospitalSpecialties(int hospitalId)
        {
            if (hospitalId == 0)
                return BadRequest("hospitalId is required");

            var specialties = await _context.HospitalSpecialties
                .Include(hs => hs.Specialty)
                .Where(hs => hs.HospitalId == hospitalId)
                .Select(hs => new
                {
                    hs.Specialty.Id,
                    hs.Specialty.Name
                })
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(specialties);
        }
    }
}