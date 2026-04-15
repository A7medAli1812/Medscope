using MedScope.Application.DTOs.Auth;
using MedScope.Application.Features.Auth;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ForgotPasswordHandler _forgotHandler;
        private readonly ResetPasswordHandler _resetHandler;

        public AuthController(
            ForgotPasswordHandler forgotHandler,
            ResetPasswordHandler resetHandler)
        {
            _forgotHandler = forgotHandler;
            _resetHandler = resetHandler;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            var message = await _forgotHandler.Handle(req);
            return Ok(new { message });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            (bool success, string message) = await _resetHandler.Handle(req);

            return success
                ? Ok(new { message })
                : BadRequest(new { message });
        }
    }
}