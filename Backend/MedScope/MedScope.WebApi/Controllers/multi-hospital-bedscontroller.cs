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
            var result = await _context.Hospitals
                .Include(h => h.Beds)
                .Select(h => new
                {
                    Hospital = h.Name,

                    TotalBeds = h.Beds.Sum(b => b.TotalBeds),
                    AvailableBeds = h.Beds.Sum(b => b.AvailableBeds),
                    //UsedBeds = h.Beds.Sum(b => b.TotalBeds - b.AvailableBeds),

                    Beds = h.Beds.Select(b => new
                    {
                        Name = b.Name,
                        TotalBeds = b.TotalBeds,
                        AvailableBeds = b.AvailableBeds
                    })
                })
                .ToListAsync();

            return Ok(result);
        
    }
    }
}