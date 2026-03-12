using MedScope.Application.DTOs.Chatbot;
using MedScope.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Patient
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/chatbot")]
    public class ChatbotController : ControllerBase
    {
        private readonly ChatbotService _service;

        public ChatbotController(ChatbotService service)
        {
            _service = service;
        }

        // =========================
        // Ask Chatbot
        // =========================
        [HttpPost("ask")]
        public async Task<IActionResult> Ask(ChatRequestDto dto)
        {
            var patientId = int.Parse(User.FindFirstValue("PatientId"));

            var result = await _service.AskAsync(patientId, dto);

            return Ok(result);
        }

        // =========================
        // Chat History
        // =========================
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var patientId = int.Parse(User.FindFirstValue("PatientId"));

            var history = await _service.GetHistoryAsync(patientId);

            return Ok(history);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var patientId = int.Parse(User.FindFirstValue("PatientId"));

            var url = await _service.SaveAttachmentAsync(patientId, file);

            return Ok(new { url });
        }
    }
}