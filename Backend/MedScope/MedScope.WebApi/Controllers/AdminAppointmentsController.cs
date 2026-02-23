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

        // 🔑 Helper صغير نستخدمه في كل الأكشنز
        private int CurrentHospitalId =>
            int.Parse(User.FindFirst("HospitalId")!.Value);

        // =========================
        // GET /api/admin/appointments/new
        // =========================
        [HttpGet("new")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<AdminAppointmentDto>>> GetNewAppointments()
        {
            var hospitalId = CurrentHospitalId;

            var result =
                await _appointmentService.GetNewAppointmentsAsync(hospitalId);

            return Ok(result);
        }

        // =========================
        // POST /api/admin/appointments
        // =========================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAppointment(
            [FromBody] CreateAppointmentDto dto)
        {
            var hospitalId = CurrentHospitalId;

            var appointmentId =
                await _appointmentService.CreateAppointmentAsync(dto, hospitalId);

            return Ok(new
            {
                message = "Appointment created successfully",
                appointmentId
            });
        }

        // =========================
        // PUT /api/admin/appointments/{id}/cancel
        // =========================
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var hospitalId = CurrentHospitalId;

            await _appointmentService.CancelAppointmentAsync(id, hospitalId);

            return Ok("Appointment cancelled successfully");
        }

        // =========================
        // PUT /api/admin/appointments/{id}/reschedule
        // =========================
        [HttpPut("{id}/reschedule")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RescheduleAppointment(
            int id,
            [FromBody] RescheduleDateTimeDto dto)
        {
            var hospitalId = CurrentHospitalId;

            await _appointmentService.RescheduleAppointmentAsync(id, dto, hospitalId);

            return Ok("Appointment rescheduled successfully");
        }

        // =========================
        // GET /api/admin/appointments/{id}
        // =========================
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AppointmentDetailsDto>> GetAppointmentById(int id)
        {
            var hospitalId = CurrentHospitalId;

            var result =
                await _appointmentService.GetAppointmentByIdAsync(id, hospitalId);

            return Ok(result);
        }
    }
}
