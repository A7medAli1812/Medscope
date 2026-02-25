using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/admin/patients")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminPatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public AdminPatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPatients([FromQuery] PatientQueryParams query)
    {
        var result = await _patientService.GetPatientsAsync(query);
        return Ok(result);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDto dto)
    {
        var result = await _patientService.UpdatePatientAsync(id, dto);

        if (!result)
            return NotFound("Patient not found");

        return Ok("Patient updated successfully");
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var result = await _patientService.DeletePatientAsync(id);

        if (!result)
            return NotFound();

        return Ok("Patient deleted (soft) successfully");
    }
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPatientById(int id)
    {
        var patient = await _patientService.GetPatientByIdAsync(id);

        if (patient == null)
            return NotFound();

        return Ok(patient);
    }
}