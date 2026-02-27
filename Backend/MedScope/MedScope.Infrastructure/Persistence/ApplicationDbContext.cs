using MedScope.Application.Abstractions.Persistence;
using MedScope.Domain.Entities;
using MedScope.Domain.Enums;
using MedScope.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace MedScope.Infrastructure.Persistence
{
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

        // =======================
        // Fluent API
        // =======================

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Convert Gender enum to string
            builder.Entity<ApplicationUser>()
                   .Property(u => u.Gender)
                   .HasConversion<string>();

            // Doctor ↔ ApplicationUser (1:1)
            builder.Entity<Doctor>()
                .HasOne<ApplicationUser>()
                .WithOne()
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Admin ↔ ApplicationUser (1:1)
            builder.Entity<Admin>()
                .HasOne<ApplicationUser>()
                .WithOne()
                .HasForeignKey<Admin>(a => a.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Patient ↔ ApplicationUser (1:1)
            builder.Entity<Patient>()
                .HasOne<ApplicationUser>()
                .WithOne()
                .HasForeignKey<Patient>(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // SuperAdmin ↔ ApplicationUser (1:1)
            builder.Entity<SuperAdmin>()
                .HasOne<ApplicationUser>()
                .WithOne()
                .HasForeignKey<SuperAdmin>(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }

        // =======================
        // Auditing
        // =======================

        public override Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.LastModifiedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}