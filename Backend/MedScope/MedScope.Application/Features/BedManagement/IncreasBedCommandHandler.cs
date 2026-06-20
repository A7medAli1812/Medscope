using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.BedManagement
{
    public class IncreaseBedCommandHandler : IRequestHandler<IncreaseBedCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public IncreaseBedCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(IncreaseBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await _context.Beds
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
                throw new Exception("Bed not found");

            bed.AvailableBeds += 1;

            _context.Beds.Update(bed);

            var rows = await _context.SaveChangesAsync(cancellationToken);

            return rows;
        }
    }
}