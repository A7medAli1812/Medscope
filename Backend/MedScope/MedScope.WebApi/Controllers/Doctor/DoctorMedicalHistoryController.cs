using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Interfaces;
using MedScope.Application.DTOs.MedicalHistory;

namespace MedScope.WebApi.Controllers.Doctor
{
    [Authorize(Roles = "Doctor")]
    [ApiController]
    [Route("api/doctor/medical-history")]
    public class DoctorMedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public DoctorMedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        // Add Chronic Disease
        [HttpPost("{appointmentId}/chronic-disease")]
        public async Task<IActionResult> AddChronicDisease(
            int appointmentId,
            [FromBody] AddChronicDiseaseDto dto)
        {
            await _service.AddChronicDiseaseAsync(appointmentId, dto);
            return Ok("Chronic disease added successfully");
        }

        // Add Surgical History
        [HttpPost("{appointmentId}/surgery")]
        public async Task<IActionResult> AddSurgery(
            int appointmentId,
            [FromBody] AddSurgicalHistoryDto dto)
        {
            await _service.AddSurgicalHistoryAsync(appointmentId, dto);
            return Ok("Surgery history added successfully");
        }

        // Add Medication
        [HttpPost("{appointmentId}/medication")]
        public async Task<IActionResult> AddMedication(
            int appointmentId,
            [FromBody] AddMedicationDto dto)
        {
            await _service.AddMedicationAsync(appointmentId, dto);
            return Ok("Medication added successfully");
        }

        // Add Allergy
        [HttpPost("{appointmentId}/allergy")]
        public async Task<IActionResult> AddAllergy(
            int appointmentId,
            [FromBody] AddAllergyDto dto)
        {
            await _service.AddAllergyAsync(appointmentId, dto);
            return Ok("Allergy added successfully");
        }
    }
}