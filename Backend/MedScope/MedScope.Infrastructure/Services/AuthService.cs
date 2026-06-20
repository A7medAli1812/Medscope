using MedScope.Application.DTOs.Auth;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
        // REGISTER (Patient only)
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
                var existingPatient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == existingUser.Id);

                if (existingPatient != null && existingPatient.IsDeleted)
                {
                    return new AuthResultDto
                    {
                        IsSuccess = false,
                        Message = "This account has been deleted"
                    };
                }

                return new AuthResultDto
                {
                    IsSuccess = false,
                    Message = "Email already registered"
                };
            }

            // 👇 الجزء اللي كان ناقص عندك
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth.ToDateTime(TimeOnly.MinValue)
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

            if (!await _roleManager.RoleExistsAsync("Patient"))
                await _roleManager.CreateAsync(new IdentityRole("Patient"));

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
        // LOGIN (JWT + HospitalId)
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

            // 👇 check على Patient
            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == user.Id);

            if (patient != null && patient.IsDeleted)
            {
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "This account has been deleted"
                };
            }

            // 👇 غيرنا الاسم هنا
            var doctorEntity = await _context.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.UserId == user.Id);

            if (doctorEntity != null && doctorEntity.IsDeleted)
            {
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "This account has been deleted"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            // =========================
            // 🔑 تحديد HospitalId حسب الدور
            // =========================
            int hospitalId = 0;

            if (roles.Contains("Admin"))
            {
                var admin = await _context.Admins
                    .Include(a => a.Hospital)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.UserId == user.Id);

                if (admin == null)
                {
                    return new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Admin is not linked to a hospital"
                    };
                }

                if (!admin.IsActive)
                {
                    return new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Your account has been deactivated. Please contact the Super Admin."
                    };
                }

                if (admin.Hospital == null || !admin.Hospital.IsActive || admin.Hospital.IsDeleted)
                {
                    return new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Your hospital has been suspended. Please contact the Super Admin."
                    };
                }

                hospitalId = admin.HospitalId;
            }
            else if (roles.Contains("Doctor"))
            {
                var doctor = await _context.Doctors
                    .Include(d => d.Hospital)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(d => d.UserId == user.Id);

                if (doctor == null)
                {
                    return new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Doctor is not linked to a hospital"
                    };
                }

                if (doctor.Hospital == null || !doctor.Hospital.IsActive || doctor.Hospital.IsDeleted)
                {
                    return new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Your hospital has been suspended. Please contact the Super Admin."
                    };
                }

                hospitalId = doctor.HospitalId;
            }
            // Patient → hospitalId = 0 (مش محتاجينه)

            // =========================
            // Generate JWT
            // =========================
            var token = _jwtTokenGenerator.GenerateToken(
                user,
                roles,
                hospitalId,
                out DateTime expiresAt);

            return new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Login successful",
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Role = roles.FirstOrDefault(),
                Token = token,
                ExpiresAt = expiresAt
            };
        }
    }
}
