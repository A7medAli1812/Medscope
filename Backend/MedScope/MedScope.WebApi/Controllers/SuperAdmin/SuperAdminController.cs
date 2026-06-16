using System.Security.Claims;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.DTOs.Admin;
using MedScope.Application.DTOs.SuperAdmin;
using MedScope.Application.DTOs.SuperAdmin.Settings;
using MedScope.Application.Features.SuperAdmin.Admins.Queries.GetAdmins;
using MedScope.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedScope.Domain.Entities;

namespace MedScope.WebApi.Controllers.SuperAdmin
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/super-admin")]
    [ApiController]
    public class SuperAdminController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ISuperAdminService _superAdminService;
        private readonly IApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;


    public SuperAdminController(
        ISuperAdminService superAdminService,
        IMediator mediator,
        IApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
        {
            _superAdminService = superAdminService;
            _context = context;
            _mediator = mediator;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // =========================
        // Helper
        // =========================
        private string? GetUserId()
        {
            return User.FindFirst("uid")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // =========================
        // Create Hospital
        // =========================
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

        // =========================
        // Get Single Hospital
        // =========================
        [HttpGet("hospitals/paginated")]
        public async Task<IActionResult> GetHospital(int id)
        {
            var hospital = await _context.Hospitals
                .Where(h => h.Id == id)
                .Select(h => new
                {
                    h.Id,
                    Name = h.Name ?? "N/A",
                    City = h.City ?? "N/A",
                    IsActive = h.IsActive
                })
                .FirstOrDefaultAsync();

            if (hospital == null)
                return NotFound("Hospital not found.");

            return Ok(hospital);
        }

        // =========================
        // ✅ Get All Hospitals (NEW)
        // =========================
        [HttpGet("All-hospitals")]
        public async Task<IActionResult> GetHospitals()
        {
            var hospitals = await _context.Hospitals
                .Select(h => new
                {
                    h.Id,
                    Name = h.Name ?? "N/A",
                    City = h.City ?? "N/A",
                    IsActive = h.IsActive
                })
                .ToListAsync();

            return Ok(hospitals);
        }

        // =========================
        // Delete Hospital
        // =========================
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

        // =========================
        // System Summary
        // =========================
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

        // =========================
        // Get Admins
        // =========================
        [HttpGet("admins")]
        public async Task<IActionResult> GetAdmins([FromQuery] GetAdminsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // =========================
        // Create Admin
        // =========================
        [HttpPost("admins")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            var hospitalExists = await _context.Hospitals
                .AnyAsync(h => h.Id == dto.HospitalId);

            if (!hospitalExists)
                return BadRequest("Invalid HospitalId");

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("Email already exists");

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

            if (!await _roleManager.RoleExistsAsync("Admin"))
                await _roleManager.CreateAsync(new IdentityRole("Admin"));

            await _userManager.AddToRoleAsync(user, "Admin");

            _context.Admins.Add(new Domain.Entities.Admin
            {
                UserId = user.Id,
                HospitalId = dto.HospitalId,
                IsActive = true
            });

            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin created successfully" });
        }

        // =========================
        // Update Admin
        // =========================
        [HttpPut("admins/{id:int}")]
        public async Task<IActionResult> UpdateAdmin(int id, [FromBody] UpdateAdminDto dto)
        {
            // 1️⃣ جيب الأدمن من جدول Admins
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Id == id);

            if (admin == null)
                return NotFound(new { message = "Admin not found." });

            // 2️⃣ جيب الـ ApplicationUser المرتبط بيه
            var user = await _userManager.FindByIdAsync(admin.UserId);

            if (user == null)
                return NotFound(new { message = "User account not found." });

            // 3️⃣ تأكد إن المستشفى الجديدة موجودة
            var hospitalExists = await _context.Hospitals
                .AnyAsync(h => h.Id == dto.HospitalId);

            if (!hospitalExists)
                return BadRequest(new { message = "Invalid HospitalId." });

            // 4️⃣ لو الإيميل اتغير، تأكد مش موجود عند حد تاني
            if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailTaken = await _userManager.FindByEmailAsync(dto.Email);
                if (emailTaken != null)
                    return BadRequest(new { message = "Email is already in use by another account." });

                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            // 5️⃣ حدّث بيانات الـ ApplicationUser
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(updateResult.Errors);

            // 6️⃣ حدّث بيانات جدول Admins
            admin.Department = dto.Department;
            admin.HospitalId = dto.HospitalId;
            admin.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin updated successfully." });
        }

        // =========================
        // Profile
        // =========================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new SuperAdminProfileDto
            {
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            });
        }

        // =========================
        // Update Profile
        // =========================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Profile updated successfully");
        }

        // =========================
        // Change Password
        // =========================
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Password changed successfully");
        }

        // =========================
        // Notifications
        // =========================
        [HttpPut("notifications")]
        public async Task<IActionResult> UpdateNotifications(UpdateNotificationSettingsDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (settings == null)
            {
                settings = new Domain.Entities.UserSettings
                {
                    UserId = userId
                };

                _context.UserSettings.Add(settings);
            }

            settings.SystemAlerts = dto.SystemAlerts;
            settings.SecurityAlerts = dto.SecurityAlerts;
            settings.AppointmentReminders = dto.AppointmentReminders;

            await _context.SaveChangesAsync();

            return Ok("Settings updated");
        }
    }


}
