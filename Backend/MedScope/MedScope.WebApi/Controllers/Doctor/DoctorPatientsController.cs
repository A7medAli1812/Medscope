using MedScope.Application.DTOs.Doctor;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Services.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Doctor
{
    [ApiController]
    [Route("api/doctor/patients")]
    [Authorize(Roles = "Doctor")] // 👈 الدكتور فقط
    public class DoctorPatientsController : ControllerBase
    {
        private readonly IDoctorPatientsListService _doctorPatientsService;
        public DoctorPatientsController(IDoctorPatientsListService doctorPatientsService)
        {
            _doctorPatientsService = doctorPatientsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctorPatients([FromQuery] DoctorPatientsQuery query)
        {
            // استخراج UserId من التوكن
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            var result = await _doctorPatientsService.GetDoctorPatients(doctorUserId, query);

            return Ok(result);

        }
    }
}