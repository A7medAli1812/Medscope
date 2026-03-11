using MedScope.Application.DTOs.Doctor.WorkingHours;
using MedScope.Application.Interfaces.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Doctor
{
    [ApiController]
    [Route("api/doctor/working-hours")]
    [Authorize(Roles = "Doctor")]
    public class DoctorWorkingHoursController : ControllerBase
    {
        private readonly IDoctorWorkingHoursService _service;

        public DoctorWorkingHoursController(IDoctorWorkingHoursService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> SaveWorkingHours([FromBody] SaveWorkingHoursDto dto)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            await _service.SaveWorkingHours(doctorUserId, dto);

            return Ok(new { message = "Working hours saved successfully" });
        }
    }
}