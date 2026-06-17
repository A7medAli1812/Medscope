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
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
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
            var rowsAffected = await _mediator.Send(new IncreaseBedCommand(id));

            return Ok(new
            {
                message = "Bed increased successfully",
                rowsAffected = rowsAffected
            });
        }

        // 🔽 Decrease available beds
        [HttpPut("{id}/decrease")]
        public async Task<IActionResult> Decrease(int id)
        {
            var rowsAffected = await _mediator.Send(new DecreaseBedCommand(id));

            return Ok(new
            {
                message = "Bed decreased successfully",
                rowsAffected = rowsAffected
            });
        }

        [HttpPut("{id}/set-total")]
        public async Task<IActionResult> SetTotal(int id, int total)
        {
            await _mediator.Send(new SetTotalBedsCommand(id, total));

            return Ok(new
            {
                message = "Total beds updated successfully"
            });
        }
    }
}