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
            // ✅ حماية لو الـ UserId فاضي
            if (string.IsNullOrEmpty(request.UserId))
                return new List<BedManagementDto>();

            // 🔥 هات المستشفى بتاعة الأدمن (UserId = string GUID)
            var hospitalId = await _context.Admins
                .Where(a => a.UserId == request.UserId)
                .Select(a => a.HospitalId)
                .FirstOrDefaultAsync(cancellationToken);

            // ❗ فلترة حسب المستشفى
            return await _context.Beds
                .Where(b => b.HospitalId == hospitalId)
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