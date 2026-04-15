using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.Auth;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace MedScope.Application.Features.Auth
{
    public class ForgotPasswordHandler
    {
        private readonly IApplicationDbContext _db;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;

        public ForgotPasswordHandler(
            IApplicationDbContext db,
            IEmailService emailService,
            UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _emailService = emailService;
            _userManager = userManager;
        }

        public async Task<string> Handle(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return "If this email exists, a code was sent.";

            var oldOtps = _db.PasswordResetOtps
                .Where(o => o.Email == request.Email);

            _db.PasswordResetOtps.RemoveRange(oldOtps);

            var otp = new Random().Next(100000, 999999).ToString();

            // ✅ هنا الإضافة المهمة 👇
            Console.WriteLine($"OTP for {request.Email}: {otp}");

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