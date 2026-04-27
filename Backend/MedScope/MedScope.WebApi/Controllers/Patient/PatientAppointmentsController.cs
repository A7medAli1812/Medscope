using System.Security.Claims;
using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Patient;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace MedScope.WebApi.Controllers.Patient
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/patient/appointments")]
    public class PatientAppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly ApplicationDbContext _context;

        public PatientAppointmentsController(
    IAppointmentService appointmentService,
    ApplicationDbContext context)
        {
            _appointmentService = appointmentService;
            _context = context;
        }
        private async Task<int> GetPatientId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return await _context.Patients
                .Where(p => p.UserId == userId)
                .Select(p => p.Id)
                .FirstOrDefaultAsync();
        }

        // =========================
        // Upcoming Appointments
        // =========================
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingAppointments()
        {
            var patientId = await GetPatientId();

            var data = await _appointmentService
                .GetUpcomingAppointmentsForPatient(patientId);

            return Ok(data);
        }

        // =========================
        // Past Appointments
        // =========================
        [HttpGet("past")]
        public async Task<IActionResult> GetPastAppointments()
        {
            var patientId = await GetPatientId();

            var data = await _appointmentService
                .GetPastAppointmentsForPatient(patientId);

            return Ok(data);
        }

        // =========================
        // Cancel Appointment
        // =========================
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var patientId = await GetPatientId();

            await _appointmentService
                .CancelAppointmentForPatient(id, patientId);

            return Ok("Appointment cancelled");
        }

        [HttpGet("hospitals")]
        public async Task<IActionResult> GetHospitals()
        {
            var hospitals = await _appointmentService.GetHospitalsForBookingAsync();

            return Ok(hospitals);
        }

        [HttpGet("specialties")]
        public async Task<List<string>> GetSpecialtiesByHospital(int hospitalId)
        {
            return await _context.Doctors
                .Include(d => d.Specialty)
                .Where(d => d.HospitalId == hospitalId && !d.IsDeleted)
                .Select(d => d.Specialty.Name)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors([FromQuery] string specialty, [FromQuery] int hospitalId)
        {
            var doctors = await _appointmentService.GetDoctorsBySpecialtyAsync(specialty, hospitalId);

            return Ok(doctors);
        }
        [HttpGet("doctor-schedule/{doctorId}")]
        public async Task<IActionResult> GetDoctorSchedule(int doctorId)
        {
            var result = await _appointmentService.GetDoctorScheduleAsync(doctorId);

            return Ok(result);
        }

        [HttpGet("review")]
        public async Task<IActionResult> GetReview()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.GetAppointmentReviewFromSessionAsync(userId);

            return Ok(result);
        }
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmAppointment([FromBody] ConfirmAppointmentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var result = await _appointmentService.ConfirmAppointmentAsync(userId, dto);

            return Ok(new
            {
                message = "Appointment confirmed successfully"
            });
        }
       
        [HttpPost("select")]
        public async Task<IActionResult> SaveSelection([FromBody] PatientCreateAppointmentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            await _appointmentService.SaveSelectionAsync(userId, dto);

            return Ok(new { message = "Selection saved successfully" });
        }

    }
}