using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using MedScope.Application.Abstractions.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.BedManagement
{
    public class SetTotalBedsCommandHandler : IRequestHandler<SetTotalBedsCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public SetTotalBedsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(SetTotalBedsCommand request, CancellationToken cancellationToken)
        {
            var bed = await _context.Beds
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
                throw new Exception("Bed not found");

            bed.TotalBeds = request.Total;

            if (bed.AvailableBeds > bed.TotalBeds)
                bed.AvailableBeds = bed.TotalBeds;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
