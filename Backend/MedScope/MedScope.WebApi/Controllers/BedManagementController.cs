using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedScope.Application.Features.BedManagement;

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

        // 🔹 عرض السراير
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _mediator.Send(new GetBedManagementQuery());
            return Ok(result);
        }

        // 🔹 إضافة سرير
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBedCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        // 🔹 حذف سرير
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteBedCommand(id));
            return NoContent();
        }

        // 🔹 تغيير حالة السرير
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            await _mediator.Send(new ToggleBedStatusCommand(id));
            return NoContent();
        }
    }
}