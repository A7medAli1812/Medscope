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

        public async Task<List<HospitalBedsDto>> Handle(
            GetHospitalsBedsQuery request,
            CancellationToken cancellationToken)
        {
            var hospitals = await _context.Hospitals
                .Include(h => h.Beds)
                .ToListAsync(cancellationToken);

            return hospitals.Select(h => new HospitalBedsDto
            {
                HospitalName = h.Name ?? "",

                Beds = h.Beds.Select(b => new BedManagementDto
                {
                    Name = b.Name,
                    TotalBeds = b.TotalBeds,
                    AvailableBeds = b.AvailableBeds
                }).ToList()
            }).ToList();
        }
    }
}