using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.BedManagementDto;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MedScope.Application.Features.BedManagement
{
    public class GetBedManagementQueryHandler
        : IRequestHandler<GetBedManagementQuery, List<BedManagementDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetBedManagementQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<BedManagementDto>> Handle(
            GetBedManagementQuery request,
            CancellationToken cancellationToken)
        {
            return await _context.Beds
                .GroupBy(b => b.Ward)
                .Select(g => new BedManagementDto
                {
                    Ward = g.Key,
                    TotalBeds = g.Count(),
                    UsedBeds = g.Count(b => b.IsOccupied)
                })
                .ToListAsync(cancellationToken);
        }
    }
}