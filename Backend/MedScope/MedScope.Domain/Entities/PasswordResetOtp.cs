using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Domain.Entities
{
    public class PasswordResetOtp
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string OtpCode { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
        public string? ResetToken { get; set; }
    }
}