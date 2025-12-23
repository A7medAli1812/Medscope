using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Admin;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    [ApiController]
    [Route("api/admin/appointments")]
    public class AdminAppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AdminAppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // GET /api/admin/appointments/new
        [HttpGet("new")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<AdminAppointmentDto>>> GetNewAppointments()
        {
            var result = await _appointmentService.GetNewAppointmentsAsync();
            return Ok(result);
        }

        // POST /api/admin/appointments
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAppointment(
            [FromBody] CreateAppointmentDto dto)
        {
            var appointmentId =
                await _appointmentService.CreateAppointmentAsync(dto);
            return Ok(new
            {
                message = "Appointment created successfully",
                appointmentId
            });
        }
        // PUT /api/admin/appointments/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            await _appointmentService.CancelAppointmentAsync(id);
            return Ok("Appointment cancelled successfully");
        }

    }
}