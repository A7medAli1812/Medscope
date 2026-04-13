using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Auth
{
    public record ResetPasswordRequest(string Email, string Otp, string NewPassword);
}