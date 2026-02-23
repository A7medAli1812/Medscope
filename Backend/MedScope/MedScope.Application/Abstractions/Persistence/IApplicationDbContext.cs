using MedScope.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MedScope.Application.Abstractions.Persistence
{
    public interface IApplicationDbContext
    {
        DbSet<Hospital> Hospitals { get; }
        DbSet<Doctor> Doctors { get; }
        DbSet<Patient> Patients { get; }
        DbSet<Appointment> Appointments { get; }
        DbSet<Bed> Beds { get; }
        DbSet<BloodBank> BloodBanks { get; }
        DbSet<MedicalRecord> MedicalRecords { get; }
        DbSet<MedScope.Domain.Entities.Admin> Admins { get; }
        DbSet<MedScope.Domain.Entities.SuperAdmin> SuperAdmins { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}