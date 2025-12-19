using MedScope.Application.DTOs.Auth;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;

namespace MedScope.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            JwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        // =========================
        // REGISTER
        // =========================
        public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
            {
                return new AuthResultDto
                {
                    IsSuccess = false,
                    Message = "Passwords do not match"
                };
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return new AuthResultDto
                {
                    IsSuccess = false,
                    Message = "Email already registered"
                };
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return new AuthResultDto
                {
                    IsSuccess = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            // Ensure Patient role exists
            if (!await _roleManager.RoleExistsAsync("Patient"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Patient"));
            }

            await _userManager.AddToRoleAsync(user, "Patient");

            _context.Patients.Add(new Patient
            {
                UserId = user.Id
            });

            await _context.SaveChangesAsync();

            return new AuthResultDto
            {
                IsSuccess = true,
                Message = "Patient registered successfully"
            };
        }

        // =========================
        // LOGIN (JWT)
        // =========================
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid email or password"
                };
            }

            var isValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isValid)
            {
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid email or password"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Patient";

            // ✅ Generate JWT
            var token = _jwtTokenGenerator.GenerateToken(
                user,
                role,
                out DateTime expiresAt);

            return new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Login successful",
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Role = role,
                Token = token,
                ExpiresAt = expiresAt
            };
        }

    }
}
