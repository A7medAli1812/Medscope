using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using MedScope.Application.Abstractions.Persistence;

namespace MedScope.Application.Features.BedManagement
{
    public class DecreaseBedCommandHandler : IRequestHandler<DecreaseBedCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public DecreaseBedCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DecreaseBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await _context.Beds.FindAsync(request.Id);

            if (bed == null)
                throw new Exception("Bed not found");

            if (bed.AvailableBeds > 0)
                bed.AvailableBeds--;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}