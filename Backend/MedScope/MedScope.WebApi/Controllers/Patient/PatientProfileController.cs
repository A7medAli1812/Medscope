using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Interfaces;
using MedScope.Application.DTOs.Patient;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Patient
{
    [ApiController]
    [Route("api/patient/profile")]
    [Authorize(Roles = "Patient")]
    public class PatientProfileController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientProfileController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // =========================
        // GET PROFILE
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _patientService.GetProfileAsync(userId);

            return Ok(result);
        }

        // =========================
        // UPDATE PROFILE
        // =========================
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _patientService.UpdateProfileAsync(userId, dto);

            if (!result)
                return BadRequest("Profile update failed");

            return Ok("Profile updated successfully");
        }


        [HttpPut("notifications")]
        public async Task<IActionResult> UpdateNotificationSettings(UpdateNotificationSettingsDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _patientService.UpdateNotificationSettingsAsync(userId, dto);

            if (!result)
                return BadRequest("Failed to update notification settings");

            return Ok("Notification settings updated");
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _patientService.ChangePasswordAsync(userId, dto);

            if (!result)
                return BadRequest("Password change failed");

            return Ok("Password changed successfully");
        }

        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _patientService.DeleteAccountAsync(userId);

            if (!result)
                return BadRequest("Failed to delete account");

            return Ok("Account deleted successfully");
        }
    }
}