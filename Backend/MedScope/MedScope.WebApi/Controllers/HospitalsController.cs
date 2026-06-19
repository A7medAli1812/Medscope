using MedScope.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/hospitals")]
    public class HospitalsController : ControllerBase
    {
        private readonly IHospitalService _hospitalService;

        public HospitalsController(IHospitalService hospitalService)
        {
            _hospitalService = hospitalService;
        }

        // =========================
        // 🏠 HOME PAGE HOSPITAL CARDS
        // =========================

        /// <summary>
        /// Returns the lightweight hospital cards displayed on the public Home Page.
        /// This endpoint is intentionally unauthenticated so the landing page can
        /// fetch hospital data without requiring a login.
        /// </summary>
        /// <returns>List of hospitals with id, name, location, imageUrl, rating, specialties.</returns>
        [HttpGet("home")]
        public async Task<IActionResult> GetHomeHospitals()
        {
            var hospitals = await _hospitalService.GetHomeHospitalsAsync();
            return Ok(hospitals);
        }
    }
}
