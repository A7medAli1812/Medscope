using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
namespace MedScope.WebApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HospitalController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("multi-hospital-beds")]
        public async Task<IActionResult> GetMultiHospitalBeds()
        {
            var result = await _context.Beds
                .Include(b => b.Hospital)
                .GroupBy(b => b.Hospital.Name)
                .Select(g => new
                {
                    Hospital = g.Key,
                    TotalBeds = g.Count(),
                    OccupiedBeds = g.Count(b => b.IsOccupied),
                    AvailableBeds = g.Count(b => !b.IsOccupied),

                    ICU = g.Count(b => b.Ward == "ICU"),
                    Emergency = g.Count(b => b.Ward == "Emergency"),
                    Pediatric = g.Count(b => b.Ward == "Pediatric")
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}