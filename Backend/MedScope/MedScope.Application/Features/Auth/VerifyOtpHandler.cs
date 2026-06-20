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
                .FirstOrDefaultAsync(o =>
                    o.Email == request.Email &&      // ✅ مهم جدًا
                    o.OtpCode == request.Otp &&
                    !o.IsUsed &&
                    o.ExpiresAt > DateTime.UtcNow);

            if (otpEntry == null)
                return (false, "Invalid or expired OTP");

            // 🔥 توليد التوكن
            var resetToken = Guid.NewGuid().ToString();

            otpEntry.ResetToken = resetToken;
            otpEntry.IsUsed = true;

            await _db.SaveChangesAsync();

            return (true, resetToken);
        }
    }
}