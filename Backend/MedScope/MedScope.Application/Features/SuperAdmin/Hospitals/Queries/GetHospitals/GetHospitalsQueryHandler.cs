using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Common;
using MedScope.Application.DTOs.SuperAdmin;
using Microsoft.EntityFrameworkCore;

public class GetHospitalsQueryHandler
: IRequestHandler<GetHospitalsQuery, PaginatedResult<HospitalDto>>
{
    private readonly IApplicationDbContext _context;


public GetHospitalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<HospitalDto>> Handle(
        GetHospitalsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Hospitals
            .Include(h => h.Admins) // ✅ لازم Include هنا
            .AsQueryable();

        // 🔍 Search
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(h =>
                h.Name != null &&
                h.Name.Contains(request.Search));
        }

        // 🎯 Filter by Status
        if (request.IsActive.HasValue)
        {
            query = query.Where(h =>
                h.IsActive == request.IsActive.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var hospitals = await query
            .OrderByDescending(h => h.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(h => new HospitalDto
            {
                Id = h.Id,

                // ✅ Safe Name
                Name = h.Name ?? "N/A",

                // ✅ Safe City
                City = h.City ?? "N/A",

                // ✅ الحل هنا
                AdminsCount = h.Admins.Count(),

                // ✅ Safe Status
                Status = h.IsActive ? "Active" : "Suspended"
            })
            .ToListAsync(cancellationToken);

        return new PaginatedResult<HospitalDto>(
            hospitals,
            totalCount,
            request.Page,
            request.PageSize
        );
    }


}
