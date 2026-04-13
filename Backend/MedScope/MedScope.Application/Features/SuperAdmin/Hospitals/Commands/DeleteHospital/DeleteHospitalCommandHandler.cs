using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;
public class DeleteHospitalCommandHandler
    : IRequestHandler<DeleteHospitalCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteHospitalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(
        DeleteHospitalCommand request,
        CancellationToken cancellationToken)
    {
        var hospital = await _context.Hospitals
            .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

        if (hospital == null)
            throw new Exception("Hospital not found");

        hospital.IsDeleted = true;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}