using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Auth;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.Auth
{
    public class VerifyOtpHandler
    {
        private readonly IApplicationDbContext _db;

        public VerifyOtpHandler(IApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<(bool Success, string Token)> Handle(VerifyOtpRequest request)
        {
            var otpEntry = await _db.PasswordResetOtps
                .FirstOrDefaultAsync(o => o.OtpCode == request.Otp);

            if (otpEntry == null)
                return (false, "Invalid OTP");

            if (otpEntry.IsUsed)
                return (false, "OTP already used");

            if (otpEntry.ExpiresAt < DateTime.UtcNow)
                return (false, "OTP expired");

            // 🔥 هنا بقى الجزء اللي انت بتسأل عليه
            var resetToken = Guid.NewGuid().ToString();

            otpEntry.IsUsed = true;
            otpEntry.ResetToken = resetToken;

            await _db.SaveChangesAsync();

            return (true, resetToken);
        }
    }
}