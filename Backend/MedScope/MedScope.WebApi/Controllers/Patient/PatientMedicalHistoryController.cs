using System.Security.Claims;
using MedScope.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers.Patient
{
    [ApiController]
    [Route("api/patient/medical-history")]
    public class PatientMedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public PatientMedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetMedicalHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _service.GetPatientMedicalHistoryAsync(userId!);

            return Ok(result);
        }
    }
}