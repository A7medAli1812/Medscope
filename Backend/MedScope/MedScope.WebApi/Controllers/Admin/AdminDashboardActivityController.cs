using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Interfaces;
using MedScope.Application.DTOs;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardActivityController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public AdminDashboardActivityController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // =========================
    // 📊 1. DASHBOARD (Doctor Stats + Cards)
    // =========================
    [HttpGet]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] int month,
        [FromQuery] int? day)
    {
        var result = await _dashboardService.GetDashboardAsync(month, day);
        return Ok(result);
    }

    
}