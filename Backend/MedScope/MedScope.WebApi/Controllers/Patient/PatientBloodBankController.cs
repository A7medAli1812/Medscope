using MedScope.Application.Abstractions.Blood;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers.Patient
{
    [ApiController]
    [Route("api/patient/blood-bank")]
    public class PatientBloodBankController : ControllerBase
    {
        private readonly IBloodBankService _bloodBankService;

        public PatientBloodBankController(IBloodBankService bloodBankService)
        {
            _bloodBankService = bloodBankService;
        }

        // =========================================
        // Get Blood Bank Data For All Hospitals
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAllHospitalsBlood()
        {
            var result = await _bloodBankService.GetAllHospitalsBloodAsync();

            return Ok(result);
        }
    }
}