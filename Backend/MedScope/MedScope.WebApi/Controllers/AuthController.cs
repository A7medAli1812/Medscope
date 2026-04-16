using MedScope.Application.DTOs.Auth;
using MedScope.Application.Features.Auth;
using MedScope.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly VerifyOtpHandler _verifyHandler;

        // ✅ تعديل الكونستركتور هنا
        public AuthController(
            IAuthService authService,
            VerifyOtpHandler verifyHandler)
        {
            _authService = authService;
            _verifyHandler = verifyHandler;
        }

        // =========================
        // REGISTER
        // =========================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);

                if (!result.IsSuccess)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Register failed",
                    error = ex.Message
                });
            }
        }

        // =========================
        // LOGIN
        // =========================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);

                if (result == null)
                {
                    return Unauthorized(new
                    {
                        message = "Invalid email or password"
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Login failed",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // =========================
        // VERIFY OTP ✅
        // =========================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
        {
            var (success, token) = await _verifyHandler.Handle(req);

            if (!success)
                return BadRequest(new { message = token });

            return Ok(new
            {
                resetToken = token,   // 🔥 ده المهم
                message = "OTP verified successfully"
            });
        }
    }
}