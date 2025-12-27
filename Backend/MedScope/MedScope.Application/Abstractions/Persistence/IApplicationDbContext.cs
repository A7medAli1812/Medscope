using MedScope.Domain.Entities;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MedScope.Application.Abstractions.Persistence
{
    public interface IApplicationDbContext
    {
        IQueryable<Hospital> Hospitals { get; }
        IQueryable<Doctor> Doctors { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
