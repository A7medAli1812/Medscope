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
    // 🔒 مؤقتًا مفتوحة – لاحقًا تتحول SuperAdmin
    // [Authorize(Roles = "SuperAdmin")]
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
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            // 1️⃣ تأكد إن المستشفى موجودة
            var hospitalExists = await _context.Hospitals
                .AnyAsync(h => h.Id == dto.HospitalId);

            if (!hospitalExists)
                return BadRequest("Invalid HospitalId");

            // 2️⃣ إنشاء اليوزر
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

            // 3️⃣ تأكد إن Role Admin موجود
            if (!await _roleManager.RoleExistsAsync("Admin"))
                await _roleManager.CreateAsync(new IdentityRole("Admin"));

            await _userManager.AddToRoleAsync(user, "Admin");

            // 4️⃣ ربط Admin بالمستشفى
            _context.Admins.Add(new Domain.Entities.Admin
            {
                UserId = user.Id,
                HospitalId = dto.HospitalId
            });

            await _context.SaveChangesAsync();

            return Ok("Admin created successfully");
        }
    }
}
