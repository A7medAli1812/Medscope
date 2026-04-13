using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;
public class ChangeHospitalStatusCommandHandler
    : IRequestHandler<ChangeHospitalStatusCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public ChangeHospitalStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(
        ChangeHospitalStatusCommand request,
        CancellationToken cancellationToken)
    {
        var hospital = await _context.Hospitals
            .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

        if (hospital == null)
            throw new Exception("Hospital not found");

        hospital.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}