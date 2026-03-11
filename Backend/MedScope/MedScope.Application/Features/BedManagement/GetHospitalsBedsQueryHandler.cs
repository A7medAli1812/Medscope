using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.BedManagementDto;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.BedManagement
{
    public class GetHospitalsBedsQueryHandler : IRequestHandler<GetHospitalsBedsQuery, List<HospitalBedsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetHospitalsBedsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<HospitalBedsDto>> Handle(GetHospitalsBedsQuery request, CancellationToken cancellationToken)
        {
            var hospitals = await _context.Hospitals
                .Include(h => h.Beds)
                .ToListAsync(cancellationToken);

            return hospitals.Select(h => new HospitalBedsDto
            {
                HospitalName = h.Name,

                Beds = new List<BedManagementDto>
            {
                new BedManagementDto
                {
                    Ward = "Total Beds",
                    TotalBeds = h.Beds.Count(),
                    UsedBeds = h.Beds.Count(b => b.IsOccupied)
                },

                new BedManagementDto
                {
                    Ward = "ICU Beds",
                    TotalBeds = h.Beds.Count(b => b.Ward == "ICU"),
                    UsedBeds = h.Beds.Count(b => b.Ward == "ICU" && b.IsOccupied)
                },

                new BedManagementDto
                {
                    Ward = "Emergency Beds",
                    TotalBeds = h.Beds.Count(b => b.Ward == "Emergency"),
                    UsedBeds = h.Beds.Count(b => b.Ward == "Emergency" && b.IsOccupied)
                },

                new BedManagementDto
                {
                    Ward = "Pediatric Beds",
                    TotalBeds = h.Beds.Count(b => b.Ward == "Pediatric"),
                    UsedBeds = h.Beds.Count(b => b.Ward == "Pediatric" && b.IsOccupied)
                }
            }
            }).ToList();
        }
    }
}
