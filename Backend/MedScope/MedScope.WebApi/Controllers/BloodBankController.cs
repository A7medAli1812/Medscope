using MedScope.Application.Abstractions.Blood;
using MedScope.Application.DTOs.BloodBank;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/[controller]")]
    public class BloodBankController : ControllerBase
    {
        private readonly IBloodBankService _service;

        public BloodBankController(IBloodBankService service)
        {
            _service = service;
        }

        // =============================
        // Get All Blood Types
        // =============================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var hospitalId = GetHospitalIdFromUser();
            var data = await _service.GetAllAsync(hospitalId);
            return Ok(data);
        }

        // =============================
        // Increase Quantity
        // =============================
        [HttpPut("{id}/increase")]
        public async Task<IActionResult> Increase(int id)
        {
            var hospitalId = GetHospitalIdFromUser();
            await _service.IncreaseAsync(id, hospitalId);
            return Ok("Quantity increased");
        }

        // =============================
        // Decrease Quantity
        // =============================
        [HttpPut("{id}/decrease")]
        public async Task<IActionResult> Decrease(int id)
        {
            var hospitalId = GetHospitalIdFromUser();
            await _service.DecreaseAsync(id, hospitalId);
            return Ok("Quantity decreased");
        }

        // =============================
        // Extract HospitalId from JWT
        // =============================
        private int GetHospitalIdFromUser()
        {
            var hospitalClaim = User.FindFirst("HospitalId");

            if (hospitalClaim == null)
                throw new UnauthorizedAccessException("HospitalId claim not found");

            return int.Parse(hospitalClaim.Value);
        }
    }
}