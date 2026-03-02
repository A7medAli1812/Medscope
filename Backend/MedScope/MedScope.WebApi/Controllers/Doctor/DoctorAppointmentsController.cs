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
    [Authorize] // 🔥 مهم
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
            // 🔥 نجيب userId من التوكن
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // 🔥 نجيب doctorId من الداتا بيز
            var doctorId = await _context.Doctors
                .Where(d => d.UserId == userId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                return NotFound("Doctor not found");

            // 🔥 ننادي على الـ service
            var result = await _appointmentService.GetUpcomingAppointmentsAsync(
                doctorId,
                date,
                view,
                page);

            return Ok(result);
        }
    }
}