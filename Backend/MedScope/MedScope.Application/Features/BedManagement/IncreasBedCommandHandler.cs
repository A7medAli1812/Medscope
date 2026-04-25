using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.BedManagement
{
    public class IncreaseBedCommandHandler : IRequestHandler<IncreaseBedCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public IncreaseBedCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(IncreaseBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await _context.Beds
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
                throw new Exception("Bed not found");

            if (bed.AvailableBeds < bed.TotalBeds)
                bed.AvailableBeds++;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}