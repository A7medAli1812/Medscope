using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        // =========================
        // CREATE ADMIN
        // =========================
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            // 1️⃣ التأكد إن المستشفى موجودة
            var hospitalExists = await _context.Hospitals
                .AnyAsync(h => h.Id == dto.HospitalId);

            if (!hospitalExists)
                return BadRequest("Invalid HospitalId");

            //  التأكد إن الإيميل مش موجود
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
                return BadRequest("Email already exists");

            //  إنشاء اليوزر
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

            // 4️⃣ التأكد إن Role Admin موجود
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole("Admin"));

                if (!roleResult.Succeeded)
                    return BadRequest(roleResult.Errors);
            }

            //  إضافة اليوزر للرول
            var addToRoleResult = await _userManager.AddToRoleAsync(user, "Admin");

            if (!addToRoleResult.Succeeded)
                return BadRequest(addToRoleResult.Errors);

            //  ربط الأدمن بالمستشفى
            _context.Admins.Add(new Domain.Entities.Admin
            {
                UserId = user.Id,
                HospitalId = dto.HospitalId
            });

            await _context.SaveChangesAsync();

            // رجوع Response ناجح
            return Ok(new
            {
                message = "Admin created successfully"
            });
        }
    }
}