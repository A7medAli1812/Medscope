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
            //  Validate passwords
            if (request.NewPassword != request.ConfirmPassword)
                return (false, "Passwords do not match");

            //  Validate token
            if (string.IsNullOrEmpty(request.ResetToken))
                return (false, "Reset token is required");

            //  نجيب OTP بناءً على التوكن فقط + expiration
            var otpEntry = await _db.PasswordResetOtps
                .Where(o =>
                    o.ResetToken == request.ResetToken &&
                    o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.Id)
                .FirstOrDefaultAsync();

            if (otpEntry == null)
                return (false, "Invalid or expired reset token");

            //  نجيب اليوزر
            var user = await _userManager.FindByEmailAsync(otpEntry.Email);

            if (user == null)
                return (false, "User not found");

            //  reset password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded)
                return (false, "Failed to reset password");

            //  نمنع إعادة الاستخدام (هنا بس)
            otpEntry.IsUsed = true;
            await _db.SaveChangesAsync();

            return (true, "Password updated successfully");
        }
    }
}