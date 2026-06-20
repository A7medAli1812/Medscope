using MedScope.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using MedScope.Infrastructure.Services;

namespace MedScope.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            // ✅ قراءة الإعدادات
            var smtpHost = _config["EmailSettings:Host"];
            var smtpPort = int.Parse(_config["EmailSettings:Port"]);
            var smtpUser = _config["EmailSettings:Email"];
            var smtpPass = _config["EmailSettings:Password"];

            // ✅ إنشاء SMTP Client
            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            // ✅ إنشاء الإيميل
            var mail = new MailMessage
            {
                From = new MailAddress(smtpUser, "MedScope"),
                Subject = "🔐 Password Reset Code",
                Body = $@"
                    <h2>MedScope Password Reset</h2>
                    <p>Your OTP code is:</p>
                    <h1 style='color:#2E86C1'>{otp}</h1>
                    <p>This code is valid for <b>10 minutes</b>.</p>
                    <p style='color:red'>Do NOT share this code.</p>
                ",
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            // ✅ إرسال الإيميل
            await client.SendMailAsync(mail);
        }
    }
}