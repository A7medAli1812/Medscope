using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Features.BedManagement;
using System.Security.Claims;

namespace MedScope.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class BedManagementController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BedManagementController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ✅ عرض الأقسام (ICU - Emergency ...)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var result = await _mediator.Send(new GetBedManagementQuery(userId));

            return Ok(result);
        }

        // 🔼 Increase available beds
        [HttpPut("{id}/increase")]
        public async Task<IActionResult> Increase(int id)
        {
            await _mediator.Send(new IncreaseBedCommand(id));

            return Ok(new
            {
                message = "Bed increased successfully"
            });
        }

        // 🔽 Decrease available beds
        [HttpPut("{id}/decrease")]
        public async Task<IActionResult> Decrease(int id)
        {
            await _mediator.Send(new DecreaseBedCommand(id));

            return Ok(new
            {
                message = "Bed decreased successfully"
            });
        }

        // ✅ (اختياري) عرض كل المستشفيات
        //[HttpGet("hospitals")]
        //public async Task<IActionResult> GetHospitalsBeds()
        //{
        //    var result = await _mediator.Send(new GetHospitalsBedsQuery());
        //    return Ok(result);
        //}
    }
}