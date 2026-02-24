using MedScope.Application.DTOs.Doctor;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        // CREATE DOCTOR
        // =========================
        [HttpPost("create")]
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto)
        {
            var hospitalIdClaim = User.FindFirst("HospitalId");

            if (hospitalIdClaim == null)
                return Unauthorized("Hospital not found in token");

            var hospitalId = int.Parse(hospitalIdClaim.Value);

            var nameParts = dto.FullName.Split(' ');
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? nameParts[1] : "";

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = firstName,
                LastName = lastName,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender   // 👈 Enum direct
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _roleManager.RoleExistsAsync("Doctor"))
                await _roleManager.CreateAsync(new IdentityRole("Doctor"));

            await _userManager.AddToRoleAsync(user, "Doctor");

            if (dto.Status == "Inactive")
            {
                user.LockoutEnd = DateTimeOffset.MaxValue;
                await _userManager.UpdateAsync(user);
            }

            _context.Doctors.Add(new Doctor
            {
                UserId = user.Id,
                Specialty = dto.Specialty,
                HospitalId = hospitalId
            });

            await _context.SaveChangesAsync();

            return Ok("Doctor created successfully");
        }

        // =========================
        // GET DOCTORS
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetDoctors(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            string? specialty = null)
        {
            var hospitalIdClaim = User.FindFirst("HospitalId");

            if (hospitalIdClaim == null)
                return Unauthorized("Hospital not found in token");

            var hospitalId = int.Parse(hospitalIdClaim.Value);

            var query =
                from d in _context.Doctors
                join u in _context.Users on d.UserId equals u.Id
                where d.HospitalId == hospitalId
                select new { d, u };

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x =>
                    x.u.FirstName.Contains(search) ||
                    x.u.LastName.Contains(search) ||
                    x.u.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(specialty))
            {
                query = query.Where(x => x.d.Specialty == specialty);
            }

            var totalCount = await query.CountAsync();

            var doctors = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    DoctorId = x.d.Id,
                    Name = x.u.FirstName + " " + x.u.LastName,
                    Email = x.u.Email,
                    PhoneNumber = x.u.PhoneNumber,
                    Specialty = x.d.Specialty,
                    Status = x.u.LockoutEnd == null ? "Active" : "Inactive"
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                data = doctors
            });
        }

        // =========================
        // TOGGLE STATUS
        // =========================
        [HttpPatch("toggle-status/{doctorId}")]
        public async Task<IActionResult> ToggleDoctorStatus(int doctorId)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Id == doctorId);

            if (doctor == null)
                return NotFound("Doctor not found");

            var user = await _userManager.FindByIdAsync(doctor.UserId);

            if (user == null)
                return NotFound("User not found");

            if (user.LockoutEnd == null)
                user.LockoutEnd = DateTimeOffset.MaxValue;
            else
                user.LockoutEnd = null;

            await _userManager.UpdateAsync(user);

            return Ok("Status updated successfully");
        }
    }
}