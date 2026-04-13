using MediatR;
using MedScope.Application.DTOs.SuperAdmin;
using MedScope.Application.Common;

public class GetHospitalsQuery : IRequest<PaginatedResult<HospitalDto>>
{
    public string? Search { get; set; }
    public bool? IsActive { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}