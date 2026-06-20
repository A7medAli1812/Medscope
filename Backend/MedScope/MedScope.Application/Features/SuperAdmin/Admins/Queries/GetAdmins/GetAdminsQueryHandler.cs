using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Common;
using MedScope.Application.Features.SuperAdmin.Admins;
using MedScope.Application.Features.SuperAdmin.Admins.Queries.GetAdmins;
using MedScope.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

public class GetAdminsQueryHandler
: IRequestHandler<GetAdminsQuery, PaginatedResult<AdminDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

public GetAdminsQueryHandler(
    IApplicationDbContext context,
    IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<PaginatedResult<AdminDto>> Handle(
        GetAdminsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Admins
            .Include(a => a.Hospital)
            .AsQueryable();

        // 🔍 Search
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(a =>
                a.Hospital != null &&
                a.Hospital.Name != null &&
                a.Hospital.Name.Contains(request.Search));
        }

        // 🎯 Filter
        if (request.HospitalId.HasValue)
        {
            query = query.Where(a =>
                a.HospitalId == request.HospitalId);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        // ✅ الحل هنا (Projection)
        var admins = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => new
            {
                a.Id,
                a.UserId,
                a.IsActive,
                HospitalName = a.Hospital != null ? a.Hospital.Name : null
            })
            .ToListAsync(cancellationToken);

        var result = new List<AdminDto>();

        foreach (var admin in admins)
        {
            var user = await _identityService
                .GetUserByIdAsync(admin.UserId);

            result.Add(new AdminDto
            {
                Id = admin.Id,
                EmployeeId = "EMP" + admin.Id,

                // ✅ Safe Name
                Name = user != null
                    ? $"{user.FirstName ?? ""} {user.LastName ?? ""}".Trim()
                    : "N/A",

                // ✅ Safe Email
                Email = user?.Email ?? "N/A",

                // ✅ Safe Hospital
                HospitalName = admin.HospitalName ?? "N/A",

                Status = admin.IsActive ? "Active" : "Suspended",
                
                // ✅ Last Login
                LastLogin = user?.LastLogin
            });
        }

        return new PaginatedResult<AdminDto>(
            result,
            totalCount,
            request.Page,
            request.PageSize
        );
    }
}
