using MediatR;
using MedScope.Application.Common;

namespace MedScope.Application.Features.SuperAdmin.Admins.Queries.GetAdmins
{
    public record GetAdminsQuery(
        int Page = 1,
        int PageSize = 10,
        string? Search = null,
        int? HospitalId = null
    ) : IRequest<PaginatedResult<AdminDto>>;
}