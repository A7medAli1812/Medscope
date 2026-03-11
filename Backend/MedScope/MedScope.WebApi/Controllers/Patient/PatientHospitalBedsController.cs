
using MedScope.Application.Features.BedManagement;
using MediatR;
using Microsoft.AspNetCore.Mvc;
namespace MedScope.WebApi.Controllers.Patient
{
  

    [ApiController]
    [Route("api/patient/hospital-beds")]
    public class PatientHospitalBedsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientHospitalBedsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetHospitalsBeds()
        {
            var result = await _mediator.Send(new GetHospitalsBedsQuery());

            return Ok(result);
        }
    }
}
