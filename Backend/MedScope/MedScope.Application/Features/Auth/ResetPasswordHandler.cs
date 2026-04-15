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
            var otpEntry = await _db.PasswordResetOtps
                .FirstOrDefaultAsync(o =>
                    o.Email == request.Email &&
                    o.OtpCode == request.Otp);

            if (otpEntry == null || otpEntry.IsUsed || otpEntry.ExpiresAt < DateTime.UtcNow)
                return (false, "Invalid or expired code.");

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return (false, "User not found.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded)
                return (false, "Failed to reset password.");

            otpEntry.IsUsed = true;
            await _db.SaveChangesAsync();

            return (true, "Password updated successfully.");
        }
    }
}