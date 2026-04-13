using MediatR;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.DTOs;
using MedScope.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.SuperAdmin.Reports;
public class GetReportsQueryHandler
    : IRequestHandler<GetReportsQuery, ReportsDto>
{
    private readonly IApplicationDbContext _context;

    public GetReportsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReportsDto> Handle(
        GetReportsQuery request,
        CancellationToken cancellationToken)
    {
        // 🔹 Total Counts
        var totalPatients = await _context.Patients.CountAsync(cancellationToken);
        var totalDoctors = await _context.Doctors.CountAsync(cancellationToken);

        // 🔹 User Growth (simple version)
        var growth = await _context.Appointments
            .GroupBy(a => a.Date)
            .Select(g => new UserGrowthDto
            {
                Date = g.Key.ToString(),
                Patients = g.Select(x => x.PatientId).Distinct().Count(),
                Doctors = g.Select(x => x.DoctorId).Distinct().Count()
            })
            .ToListAsync(cancellationToken);

        // 🔹 Hospital Distribution
        var distribution = await _context.Hospitals
            .GroupBy(h => h.City)
            .Select(g => new HospitalDistributionDto
            {
                City = g.Key,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        return new ReportsDto
        {
            TotalPatients = totalPatients,
            TotalDoctors = totalDoctors,
            UserGrowth = growth,
            HospitalDistribution = distribution
        };
    }
}