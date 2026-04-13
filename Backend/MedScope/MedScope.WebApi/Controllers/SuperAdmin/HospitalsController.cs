using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace MedScope.Application.Features.SuperAdmin.Hospitals;
[ApiController]
[Route("api/super-admin/hospitals")]
[Authorize(Roles = "SuperAdmin")]
public class HospitalsController : ControllerBase
{
    private readonly IMediator _mediator;

    public HospitalsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetHospitals([FromQuery] GetHospitalsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
 }
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeHospitalStatusCommand command)
    {
        command.Id = id;

        await _mediator.Send(command);

        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteHospitalCommand { Id = id });
        return NoContent();
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateHospitalCommand command)
    {
        command.Id = id;

        await _mediator.Send(command);

        return NoContent();
    }
}
