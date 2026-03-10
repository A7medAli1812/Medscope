using MedScope.Application.DTOs.Doctor;
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
        private readonly IDoctorPatientNoteUpdateService _updateService;

        public DoctorPatientNotesController(
            IDoctorPatientNotesService notesService,
            IDoctorPatientNoteUpdateService updateService)
        {
            _notesService = notesService;
            _updateService = updateService;
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

        // =========================
        // Get Patient Notes
        // =========================
        [HttpGet("{patientId}/notes")]
        public async Task<IActionResult> GetPatientNotes(int patientId)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            var notes = await _notesService.GetPatientNotes(patientId, doctorUserId);

            return Ok(notes);
        }

        // =========================
        // Update Note
        // =========================
        [HttpPut("notes/{noteId}")]
        public async Task<IActionResult> UpdateNote(int noteId, [FromBody] UpdateDoctorNoteDto dto)
        {
            var doctorUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (doctorUserId == null)
                return Unauthorized();

            await _updateService.UpdateNote(noteId, doctorUserId, dto);

            return Ok(new { message = "Note updated successfully" });
        }
    }
}