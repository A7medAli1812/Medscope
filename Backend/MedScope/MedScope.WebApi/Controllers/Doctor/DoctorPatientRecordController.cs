using MedScope.Application.Interfaces.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Doctor
{
    [ApiController]
    [Route("api/doctor/patients")]
    [Authorize(Roles = "Doctor")]
    public class DoctorPatientRecordController : ControllerBase
    {
        private readonly IDoctorPatientRecordService _recordService;

        public DoctorPatientRecordController(IDoctorPatientRecordService recordService)
        {
            _recordService = recordService;
        }

        [HttpGet("{patientId}/record")]
        public async Task<IActionResult> GetPatientRecord(int patientId)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            var result = await _recordService.GetPatientRecord(patientId, doctorUserId);

            return Ok(result);
        }
    }
}