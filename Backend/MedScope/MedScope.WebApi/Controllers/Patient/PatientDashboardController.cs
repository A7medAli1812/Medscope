using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Interfaces;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers.Patient
{
    [ApiController]
    [Route("api/patient/dashboard")]
    [Authorize(Roles = "Patient")]
    public class PatientDashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public PatientDashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _dashboardService.GetPatientDashboardAsync(userId);

            return Ok(result);
        }
    }
}