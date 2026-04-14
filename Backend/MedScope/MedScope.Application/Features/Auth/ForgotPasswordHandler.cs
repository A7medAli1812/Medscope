using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Auth;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.Auth
{
    public class ForgotPasswordHandler
    {
        private readonly IApplicationDbContext _db;
        private readonly IEmailService _emailService;

        public ForgotPasswordHandler(IApplicationDbContext db, IEmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        public async Task<string> Handle(ForgotPasswordRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return "If this email exists, a code was sent.";

            var oldOtps = _db.PasswordResetOtps.Where(o => o.Email == request.Email);
            _db.PasswordResetOtps.RemoveRange(oldOtps);

            var otp = new Random().Next(100000, 999999).ToString();

            await _db.PasswordResetOtps.AddAsync(new PasswordResetOtp
            {
                Email = request.Email,
                OtpCode = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            });

            await _db.SaveChangesAsync();
            await _emailService.SendOtpEmailAsync(request.Email, otp);

            return "Code sent to your email.";
        }
    }
}