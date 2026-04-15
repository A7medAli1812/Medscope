using MedScope.Application.Abstractions.Persistence;
using MedScope.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MedScope.Infrastructure.Persistence;

public class ApplicationDbContext
    : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // =======================
    // DbSets
    // =======================

    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Bed> Beds { get; set; }
    public DbSet<BloodBank> BloodBanks { get; set; }
    public DbSet<MedicalRecord> MedicalRecords { get; set; }
    public DbSet<Hospital> Hospitals { get; set; }
    public DbSet<SuperAdmin> SuperAdmins { get; set; }
    public DbSet<ChronicDisease> ChronicDiseases { get; set; }
    public DbSet<SurgicalHistory> SurgicalHistories { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<Allergy> Allergies { get; set; }
    public DbSet<DoctorNote> DoctorNotes { get; set; }
    public DbSet<DoctorWorkingHours> DoctorWorkingHours { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }
    public DbSet<PasswordResetOtp> PasswordResetOtps { get; set; }

    // =======================
    // Fluent API
    // =======================

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>()
               .Property(u => u.Gender)
               .HasConversion<string>();

        builder.Entity<Doctor>()
            .HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<Doctor>(d => d.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Admin>()
            .HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<Admin>(a => a.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Patient>()
            .HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<Patient>(p => p.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<SuperAdmin>()
            .HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<SuperAdmin>(s => s.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<DoctorNote>()
            .HasOne<Patient>()
            .WithMany()
            .HasForeignKey(n => n.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<DoctorNote>()
            .HasOne<Doctor>()
            .WithMany()
            .HasForeignKey(n => n.DoctorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<BloodBank>()
            .HasIndex(b => new { b.BloodType, b.HospitalId })
            .IsUnique();

        builder.Entity<Hospital>()
            .HasQueryFilter(h => !h.IsDeleted);
    }

    // =======================
    // Audit
    // =======================

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = DateTime.UtcNow;

            else if (entry.State == EntityState.Modified)
                entry.Entity.LastModifiedAt = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}