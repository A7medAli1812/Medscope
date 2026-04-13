using MedScope.Application.DTOs.Patient;
using MedScope.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Patient
{
    [ApiController]
    [Route("api/patient/notes")]
    public class PatientNotesController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public PatientNotesController(IMedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _service.GetPatientNotesAsync(userId!);

            return Ok(result);
        }
    }
}