using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MedScope.Infrastructure.Identity
{
    public class JwtTokenGenerator
    {
        private readonly AuthSettings _settings;

        public JwtTokenGenerator(IOptions<AuthSettings> options)
        {
            _settings = options.Value;
        }

        public string GenerateToken(
            ApplicationUser user,
            IList<string> roles,
            int hospitalId,                 // ✅ دخلنا HospitalId
            out DateTime expiresAt)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };

            // ✅ Claim الخاصة بالمستشفى (Multi-Hospital)
            claims.Add(new Claim("HospitalId", hospitalId.ToString()));

            // ✅ Roles
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Key));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            expiresAt = DateTime.UtcNow
                .AddMinutes(_settings.ExpiryInMinutes);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}
