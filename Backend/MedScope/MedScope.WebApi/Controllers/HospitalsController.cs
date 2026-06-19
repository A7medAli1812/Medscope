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

        /// <summary>
        /// Uploads an image for a specific hospital and returns the image URL.
        /// </summary>
        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadHospitalImage(int id, IFormFile file)
        {
            try
            {
                var imageUrl = await _hospitalService.UploadHospitalImageAsync(id, file);
                return Ok(new { ImageUrl = imageUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
