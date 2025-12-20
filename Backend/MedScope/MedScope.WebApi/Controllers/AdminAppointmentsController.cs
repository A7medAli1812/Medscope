using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;   // 👈 ضيفي دي
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/admin/appointments")]
    //[Authorize(Roles = "Admin")]   // 👈 السطر المهم
    public class AdminAppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AdminAppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // GET: api/admin/appointments/new
        [HttpGet("new")]
        public async Task<ActionResult<List<AdminAppointmentDto>>> GetNewAppointments()
        {
            var result = await _appointmentService.GetNewAppointmentsAsync();
            return Ok(result);
        }
    }
}
