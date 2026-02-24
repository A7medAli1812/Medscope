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

        // 🔑 Helper
        private int CurrentHospitalId =>
            int.Parse(User.FindFirst("HospitalId")!.Value);

        // =========================
        // GET /api/admin/appointments/new
        // =========================
        [HttpGet("new")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetNewAppointments(
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 10,
     [FromQuery] string? search = null,
     [FromQuery] DateOnly? date = null)
        {
            var hospitalId = CurrentHospitalId;

            var result = await _appointmentService
                .GetNewAppointmentsAsync(
                    hospitalId,
                    page,
                    pageSize,
                    search,
                    date);

            return Ok(new
            {
                totalCount = result.TotalCount,
                page,
                pageSize,
                data = result.Data
            });
        }
        // =========================
        // GET /api/admin/appointments/completed
        // =========================
        [HttpGet("completed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCompletedAppointments(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            DateOnly? date = null)
        {
            var hospitalId = CurrentHospitalId;

            var result = await _appointmentService
                .GetCompletedAppointmentsAsync(
                    hospitalId,
                    page,
                    pageSize,
                    search,
                    date);

            return Ok(new
            {
                totalCount = result.TotalCount,
                page,
                pageSize,
                data = result.Data
            });
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
        // PUT /api/admin/appointments/{id}/complete
        // =========================
        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CompleteAppointment(int id)
        {
            var hospitalId = CurrentHospitalId;

            await _appointmentService
                .CompleteAppointmentAsync(id, hospitalId);

            return Ok("Appointment marked as completed");
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