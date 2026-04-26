using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.BedManagementDto;
using Microsoft.EntityFrameworkCore;

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

            var beds = await _context.Beds
                .Where(b => b.HospitalId == hospitalId)
                .ToListAsync(cancellationToken);

            // 🔥 الأقسام المطلوبة في UI
            var requiredSections = new List<string>
            {
                "ICU",
                "Emergency",
                "Pediatric",
                "Operating Room (OR) Beds"
            };

            // 🔥 نعمل lookup سريع
            var result = new List<BedManagementDto>();

            foreach (var section in requiredSections)
            {
                var bed = beds.FirstOrDefault(b => b.Name == section);

                if (bed != null)
                {
                    result.Add(new BedManagementDto
                    {
                        Id = bed.Id,
                        Name = bed.Name,
                        TotalBeds = bed.TotalBeds,
                        AvailableBeds = bed.AvailableBeds
                    });
                }
                else
                {
                    // ❗️ fallback بس (مش بنخزن في DB)
                    result.Add(new BedManagementDto
                    {
                        Id = 0,
                        Name = section,
                        TotalBeds = 0,
                        AvailableBeds = 0
                    });
                }
            }

            return result;
        }
    }
}