using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Auth;
using MedScope.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.Auth
{
    public class ResetPasswordHandler
    {
        private readonly IApplicationDbContext _db;

        public ResetPasswordHandler(IApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<(bool Success, string Message)> Handle(ResetPasswordRequest request)
        {
            var otpEntry = await _db.PasswordResetOtps
                .FirstOrDefaultAsync(o => o.Email == request.Email
                                       && o.OtpCode == request.Otp);

            if (otpEntry == null || otpEntry.IsUsed || otpEntry.ExpiresAt < DateTime.UtcNow)
                return (false, "Invalid or expired code.");

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return (false, "User not found.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            otpEntry.IsUsed = true;

            await _db.SaveChangesAsync();
            return (true, "Password updated successfully.");
        }
    }
}