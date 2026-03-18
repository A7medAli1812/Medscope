using MedScope.Application.Abstractions.Appointments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [Authorize(Roles = "Admin,Patient")]
    [ApiController]
    [Route("api/booking")]
    public class BookingController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public BookingController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // 🟢 Available Dates
        [HttpGet("available-dates")]
        public async Task<IActionResult> GetAvailableDates(int doctorId)
        {
            var result = await _appointmentService.GetDoctorAvailableDatesAsync(doctorId);
            return Ok(result);
        }

        // 🟢 Available Slots
        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots(int doctorId, DateOnly date)
        {
            var result = await _appointmentService.GetDoctorAvailableSlotsAsync(doctorId, date);
            return Ok(result);
        }
    }
}
