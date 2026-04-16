using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Auth;
using MedScope.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.Auth
{
    public class ResetPasswordHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IApplicationDbContext _db;

        public ResetPasswordHandler(
            IApplicationDbContext db,
            UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }


        public async Task<(bool Success, string Message)> Handle(ResetPasswordRequest request)
        {
            // ✅ check confirm password
            if (request.NewPassword != request.ConfirmPassword)
                return (false, "Passwords do not match");

            // 🔥 نجيب آخر OTP متحقق (مش مستخدم)
            var otpEntry = await _db.PasswordResetOtps
                .Where(o => !o.IsUsed && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.ExpiresAt)
                .FirstOrDefaultAsync();

            if (otpEntry == null)
                return (false, "No verified OTP found");

            // 🔥 نجيب اليوزر
            var user = await _userManager.FindByEmailAsync(otpEntry.Email);

            if (user == null)
                return (false, "User not found");

            // 🔥 reset password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded)
                return (false, "Failed to reset password");

            // 🔥 نمنع إعادة الاستخدام
            otpEntry.IsUsed = true;
            await _db.SaveChangesAsync();

            return (true, "Password updated successfully");
        }
    }
}