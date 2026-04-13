
using MediatR;

namespace MedScope.Application.Features.SuperAdmin.Reports;
public record GetReportsQuery(int Month)
    : IRequest<ReportsDto>;