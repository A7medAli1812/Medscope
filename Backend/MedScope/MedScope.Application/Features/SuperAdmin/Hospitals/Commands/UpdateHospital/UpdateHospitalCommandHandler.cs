using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;

public class UpdateHospitalCommandHandler
    : IRequestHandler<UpdateHospitalCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateHospitalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(
        UpdateHospitalCommand request,
        CancellationToken cancellationToken)
    {
        var hospital = await _context.Hospitals
            .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

        if (hospital == null)
            throw new Exception("Hospital not found");

        hospital.Name = request.Name;
        hospital.Phone = request.Phone;
        hospital.Email = request.Email;
        hospital.Website = request.Website;
        hospital.HospitalNumber = request.HospitalNumber;
        hospital.Type = request.Type;
        hospital.City = request.City;
        hospital.Address = request.Address;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}