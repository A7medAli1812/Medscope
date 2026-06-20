using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs.BedManagementDto;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.BedManagement
{
    public class GetHospitalsBedsQueryHandler
        : IRequestHandler<GetHospitalsBedsQuery, List<HospitalBedsDto>>
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

            return hospitals.Select(h =>
            {
                var beds = h.Beds ?? new List<Domain.Entities.Bed>();

                // 🔥 Normalize names (lowercase)
                var normalizedBeds = beds
                    .GroupBy(b => b.Name.ToLower())
                    .ToDictionary(
                        g => g.Key,
                        g => new
                        {
                            Total = g.Sum(x => x.TotalBeds),
                            Available = g.Sum(x => x.AvailableBeds)
                        });

                int GetTotal(string name) =>
                    normalizedBeds.ContainsKey(name.ToLower()) ? normalizedBeds[name.ToLower()].Total : 0;

                int GetAvailable(string name) =>
                    normalizedBeds.ContainsKey(name.ToLower()) ? normalizedBeds[name.ToLower()].Available : 0;

                var totalBeds = beds.Sum(b => b.TotalBeds);
                var totalAvailable = beds.Sum(b => b.AvailableBeds);

                return new HospitalBedsDto
                {
                    HospitalName = h.Name ?? "",

                    Beds = new List<BedManagementDto>
            {
                new BedManagementDto
                {
                    Name = "Total Beds",
                    TotalBeds = totalBeds,
                    AvailableBeds = totalAvailable
                },

                new BedManagementDto
                {
                    Name = "ICU Beds",
                    TotalBeds = GetTotal("ICU"),
                    AvailableBeds = GetAvailable("ICU")
                },

                new BedManagementDto
                {
                    Name = "Emergency Beds",
                    TotalBeds = GetTotal("Emergency"),
                    AvailableBeds = GetAvailable("Emergency")
                },

                new BedManagementDto
                {
                    Name = "Pediatric Beds",
                    TotalBeds = GetTotal("Pediatric"),
                    AvailableBeds = GetAvailable("Pediatric")
                },

                new BedManagementDto
                {
                    Name = "Operating Room (OR) Beds",
                    TotalBeds = GetTotal("Operating Room (OR) Beds"),
                    AvailableBeds = GetAvailable("Operating Room (OR) Beds")
                }
            }
                };
            }).ToList();
        }
    }
}