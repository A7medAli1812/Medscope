using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Interfaces;

[ApiController]
[Route("api/admin/patients-chart")]
[Authorize(Roles = "Admin")]
public class PatientsChartController : ControllerBase
{
    private readonly IPatientsChartService _service;

    public PatientsChartController(IPatientsChartService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int month,
        [FromQuery] int page = 1)
    {
        var result = await _service.GetPatientsChartAsync(month, page);
        return Ok(result);
    }
}
