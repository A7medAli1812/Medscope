using MedScope.Application.Abstractions.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly IAdminDashboardService _service;

    public AdminDashboardController(IAdminDashboardService service)
    {
        _service = service;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var hospitalIdClaim = User.FindFirst("hospitalId")?.Value;

        if (string.IsNullOrEmpty(hospitalIdClaim))
            return Unauthorized("HospitalId not found in token");

        if (!int.TryParse(hospitalIdClaim, out var hospitalId))
            return BadRequest("Invalid HospitalId");

        var result = await _service.GetSummaryAsync(hospitalId);
        return Ok(result);
    }
}
//test