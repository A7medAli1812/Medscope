using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace MedScope.WebApi.Controllers
{
    [Route("api/doctor/appointments")]
    [ApiController]
    [Authorize(Roles = "Doctor")] // 🔥 Doctor only
    public class DoctorAppointmentsController : ControllerBase
    {
        private readonly IDoctorAppointmentService _appointmentService;
        private readonly ApplicationDbContext _context;

        public DoctorAppointmentsController(
            IDoctorAppointmentService appointmentService,
            ApplicationDbContext context)
        {
            _appointmentService = appointmentService;
            _context = context;
        }

        // ===========================
        // Get Upcoming Appointments
        // ===========================
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingAppointments(
            [FromQuery] DateOnly date,
            [FromQuery] string view,
            [FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var doctorId = await _context.Doctors
                .Where(d => d.UserId == userId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                return NotFound("Doctor not found");

            var result = await _appointmentService.GetUpcomingAppointmentsAsync(
                doctorId,
                date,
                view,
                page);

            return Ok(result);
        }

        // ===========================
        // 🔥 Visit Details (secure)
        // ===========================
        [HttpGet("visit-details/{appointmentId}")]
        public async Task<IActionResult> GetVisitDetails(int appointmentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var doctorId = await _context.Doctors
                .Where(d => d.UserId == userId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                return NotFound("Doctor not found");

            var result = await _appointmentService
                .GetAppointmentVisitDetailsAsync(appointmentId, doctorId);

            if (result == null)
                return NotFound("Appointment not found");

            return Ok(result);
        }
    }
}