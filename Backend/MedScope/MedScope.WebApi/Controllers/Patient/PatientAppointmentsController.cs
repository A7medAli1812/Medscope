using System.Security.Claims;
using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.DTOs.Patient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace MedScope.WebApi.Controllers.Patient
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/patient/appointments")]
    public class PatientAppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public PatientAppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // =========================
        // Upcoming Appointments
        // =========================
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingAppointments()
        {
            var patientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

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
            var patientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

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
            var patientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

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
        public async Task<IActionResult> GetSpecialties()
        {
            var specialties = await _appointmentService.GetSpecialtiesAsync();

            return Ok(specialties);
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
        public async Task<IActionResult> GetReview(int doctorId, DateOnly date, TimeOnly time)
        {
            var patientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _appointmentService.GetAppointmentReviewAsync(doctorId, date, time, patientId);

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] PatientCreateAppointmentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var appointmentId = await _appointmentService.CreateAppointmentForPatientAsync(userId, dto);

            return Ok(new
            {
                message = "Appointment booked successfully",
                appointmentId = appointmentId
            });
        }
        [HttpGet("booking-form")]
        public async Task<IActionResult> GetBookingForm()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.GetBookingFormAsync(userId);

            return Ok(result);
        }

    }
}