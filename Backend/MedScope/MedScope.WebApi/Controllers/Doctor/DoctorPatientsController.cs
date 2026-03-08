using MedScope.Application.DTOs.Doctor;
using MedScope.Application.Interfaces.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Doctor
{
    [ApiController]
    [Route("api/doctor/patients")]
    [Authorize(Roles = "Doctor")]
    public class DoctorPatientsController : ControllerBase
    {
        private readonly IDoctorPatientsListService _doctorPatientsService;
        private readonly IDoctorPatientDeleteService _doctorPatientDeleteService;

        public DoctorPatientsController(
            IDoctorPatientsListService doctorPatientsService,
            IDoctorPatientDeleteService doctorPatientDeleteService)
        {
            _doctorPatientsService = doctorPatientsService;
            _doctorPatientDeleteService = doctorPatientDeleteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctorPatients([FromQuery] DoctorPatientsQuery query)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            var result = await _doctorPatientsService.GetDoctorPatients(doctorUserId, query);

            return Ok(result);
        }

        // DELETE PATIENT
        [HttpDelete("{patientId}")]
        public async Task<IActionResult> DeletePatient(int patientId)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            var result = await _doctorPatientDeleteService.DeletePatient(patientId, doctorUserId);

            return Ok(new { message = "Patient deleted successfully" });
        }
    }
}