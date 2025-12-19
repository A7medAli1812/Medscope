using MedScope.Application.DTOs.Doctor;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/doctor")]
    [Authorize(Roles = "Admin")]
    public class DoctorController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public DoctorController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        // =========================
        // CREATE DOCTOR (Admin only)
        // =========================
        [HttpPost("create-doctor")]
        public async Task<IActionResult> CreateDoctor(
            [FromBody] CreateDoctorDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _roleManager.RoleExistsAsync("Doctor"))
                await _roleManager.CreateAsync(new IdentityRole("Doctor"));

            await _userManager.AddToRoleAsync(user, "Doctor");

            _context.Doctors.Add(new Doctor
            {
                UserId = user.Id,
                Specialty = dto.Specialty,
                LicenseNumber = dto.LicenseNumber
            });

            await _context.SaveChangesAsync();

            return Ok("Doctor created successfully");
        }
    }
}
