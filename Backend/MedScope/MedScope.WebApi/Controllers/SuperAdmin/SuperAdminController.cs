using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.DTOs.SuperAdmin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.SuperAdmin
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/super-admin")]
    [ApiController]
    public class SuperAdminController : ControllerBase
    {
        private readonly ISuperAdminService _superAdminService;
        private readonly IApplicationDbContext _context;

        public SuperAdminController(
            ISuperAdminService superAdminService,
            IApplicationDbContext context)
        {
            _superAdminService = superAdminService;
            _context = context;
        }

        // =========================================
        // 1️⃣ Create Hospital
        // =========================================
        [HttpPost("create-hospital")]
        public async Task<IActionResult> CreateHospital(CreateHospitalDto dto)
        {
            try
            {
                await _superAdminService.CreateHospitalAsync(dto);
                return Ok("Hospital created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // =========================================
        // 2️⃣ Get All Hospitals
        // =========================================
        [HttpGet("hospitals")]
        public async Task<IActionResult> GetAllHospitals()
        {
            var hospitals = await _context.Hospitals.ToListAsync();
            return Ok(hospitals);
        }

        // =========================================
        // 3️⃣ Get Hospital By Id
        // =========================================
        [HttpGet("hospital/{id}")]
        public async Task<IActionResult> GetHospital(int id)
        {
            var hospital = await _context.Hospitals
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hospital == null)
                return NotFound("Hospital not found.");

            return Ok(hospital);
        }

        // =========================================
        // 4️⃣ Delete Hospital
        // =========================================
        [HttpDelete("hospital/{id}")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            var hospital = await _context.Hospitals
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hospital == null)
                return NotFound("Hospital not found.");

            _context.Hospitals.Remove(hospital);
            await _context.SaveChangesAsync();

            return Ok("Hospital deleted successfully.");
        }

        // =========================================
        // 5️⃣ System Summary
        // =========================================
        [HttpGet("system-summary")]
        public async Task<IActionResult> GetSystemSummary()
        {
            var result = new
            {
                Hospitals = await _context.Hospitals.CountAsync(),
                Doctors = await _context.Doctors.CountAsync(),
                Patients = await _context.Patients.CountAsync(),
                Appointments = await _context.Appointments.CountAsync()
            };

            return Ok(result);
        }
        [AllowAnonymous]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated,
                Name = User.Identity?.Name,
                Role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value,
                HospitalId = User.Claims.FirstOrDefault(c => c.Type == "HospitalId")?.Value
            });
        }
    }
    }
