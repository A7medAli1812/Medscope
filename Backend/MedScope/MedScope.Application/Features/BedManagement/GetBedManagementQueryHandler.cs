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
            if (string.IsNullOrEmpty(request.UserId))
                return new List<BedManagementDto>();

            var hospitalId = await _context.Admins
                .Where(a => a.UserId == request.UserId)
                .Select(a => a.HospitalId)
                .FirstOrDefaultAsync(cancellationToken);

            // ✅ هات البيانات من DB
            var beds = await _context.Beds
                .Where(b => b.HospitalId == hospitalId)
                .Select(b => new BedManagementDto
                {
                    Name = b.Name,
                    TotalBeds = b.TotalBeds,
                    AvailableBeds = b.AvailableBeds
                })
                .ToListAsync(cancellationToken);

            // 🔥 الأقسام الأساسية
            var defaultBeds = new List<BedManagementDto>
            {
                new() { Name = "ICU", TotalBeds = 50, AvailableBeds = 50 },
                new() { Name = "Emergency", TotalBeds = 22, AvailableBeds = 22 },
                new() { Name = "Pediatric", TotalBeds = 30, AvailableBeds = 30 },
                new() { Name = "Operating Room (OR) Beds", TotalBeds = 19, AvailableBeds = 19 }
            };

            // ✅ لو ناقص حاجة يضيفها
            foreach (var def in defaultBeds)
            {
                if (!beds.Any(b => b.Name == def.Name))
                {
                    beds.Add(def);
                }
            }

            return beds;
        }
    }
}