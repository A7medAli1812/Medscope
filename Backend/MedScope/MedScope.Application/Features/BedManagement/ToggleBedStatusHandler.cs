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
    public class ToggleBedStatusCommandHandler
        : IRequestHandler<ToggleBedStatusCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public ToggleBedStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(
            ToggleBedStatusCommand request,
            CancellationToken cancellationToken)
        {
            var bed = await _context.Beds
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
                throw new Exception("Bed not found");

            bed.IsOccupied = !bed.IsOccupied;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}