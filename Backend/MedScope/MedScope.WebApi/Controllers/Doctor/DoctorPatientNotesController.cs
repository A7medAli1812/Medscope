using MedScope.Application.DTOs.Doctor.Notes;
using MedScope.Application.Interfaces.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Doctor
{
    [ApiController]
    [Route("api/doctor/patients")]
    [Authorize(Roles = "Doctor")]
    public class DoctorPatientNotesController : ControllerBase
    {
        private readonly IDoctorPatientNotesService _notesService;

        public DoctorPatientNotesController(IDoctorPatientNotesService notesService)
        {
            _notesService = notesService;
        }

        [HttpPost("{patientId}/notes")]
        public async Task<IActionResult> AddNote(int patientId, [FromBody] AddPatientNoteDto dto)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            await _notesService.AddPatientNote(patientId, doctorUserId, dto);

            return Ok(new { message = "Note added successfully" });
        }
    }
}