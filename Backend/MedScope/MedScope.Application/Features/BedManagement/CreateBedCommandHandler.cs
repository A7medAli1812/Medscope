using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Domain.Entities;

namespace MedScope.Application.Features.BedManagement
{
    public class CreateBedCommandHandler : IRequestHandler<CreateBedCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateBedCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateBedCommand request, CancellationToken cancellationToken)
        {
            // Check if hospital exists
            var hospitalExists = _context.Hospitals
                .Any(h => h.Id == request.HospitalId);

            if (!hospitalExists)
                throw new Exception("Hospital not found");

            var bed = new Bed
            {
                BedNumber = request.BedNumber,
                Ward = request.Ward,
                HospitalId = request.HospitalId,
                IsOccupied = false
            };

            _context.Beds.Add(bed);
            await _context.SaveChangesAsync(cancellationToken);

            return bed.Id;
        }
    }
}