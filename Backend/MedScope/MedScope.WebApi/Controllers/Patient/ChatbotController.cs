using MedScope.Application.DTOs.Chatbot;
using MedScope.Infrastructure.Services;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace MedScope.WebApi.Controllers.Patient
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/chatbot")]
    public class ChatbotController : ControllerBase
    {
        private readonly ChatbotService _service;
        private readonly ApplicationDbContext _context;

        public ChatbotController(ChatbotService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }

        // =========================
        // Helper
        // =========================
        private async Task<int> GetPatientId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return await _context.Patients
                .Where(p => p.UserId == userId)
                .Select(p => p.Id)
                .FirstOrDefaultAsync();
        }

        // =========================
        // Ask Chatbot
        // =========================
        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequestDto dto)
        {
            var patientId = await GetPatientId();

            var result = await _service.AskAsync(patientId, dto);

            return Ok(result);
        }

        // =========================
        // Chat History
        // =========================
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var patientId = await GetPatientId();

            var history = await _service.GetHistoryAsync(patientId);

            return Ok(history);
        }

        // =========================
        // Upload Attachment
        // =========================
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]   // 👈 دي أهم حاجة
        public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file , [FromForm] string? message)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var patientId = await GetPatientId();

            var url = await _service.SaveAttachmentAsync(patientId, file, message);

            return Ok(new { url });
        }
    }
}