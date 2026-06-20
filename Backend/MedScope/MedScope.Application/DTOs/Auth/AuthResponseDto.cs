namespace MedScope.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;

        public string? UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }

        // ✅ JWT
        public string? Token { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
