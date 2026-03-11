using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.Abstractions.Blood;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Interfaces;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Services;
using MedScope.Infrastructure.Services.Doctor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MedScope.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureLayer(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // =========================
            // Auth
            // =========================
            services.AddScoped<IAuthService, AuthService>();

            services.Configure<AuthSettings>(
                configuration.GetSection("AuthSettings"));

            services.AddScoped<JwtTokenGenerator>();

            // =========================
            // Appointments
            // =========================
            services.AddScoped<IAppointmentService, AppointmentService>();

            // =========================
            // Blood Bank
            // =========================
            services.AddScoped<IBloodBankService, BloodBankService>();

            // =========================
            // DbContext Interface
            // =========================
            services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

            // =========================
            // Patient
            // =========================
            services.AddScoped<IPatientService, PatientService>();

            // =========================
            // Dashboard
            // =========================
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IPatientsChartService, PatientsChartService>();

            // =========================
            // Medical History
            // =========================
            services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();

            // =========================
            // Doctor
            // =========================
            services.AddScoped<IDoctorAppointmentService, DoctorAppointmentService>();
            services.AddScoped<IDoctorPatientsListService, DoctorPatientsService>();
            services.AddScoped<IDoctorPatientRecordService, DoctorPatientRecordService>();
            services.AddScoped<IDoctorPatientDeleteService, DoctorPatientDeleteService>();
            services.AddScoped<IDoctorPatientNotesService, DoctorPatientNotesService>();
            services.AddScoped<IDoctorPatientNoteUpdateService, DoctorPatientNoteUpdateService>();

            return services;
        }
    }
}