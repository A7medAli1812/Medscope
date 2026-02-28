using MedScope.Application.Abstractions.Appointments;
using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Services;
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
            services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
            services.AddScoped<IPatientService, PatientService>();

            // =========================
            // Dashboard 🔥
            // =========================
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IPatientsChartService, PatientsChartService>();




            return services;
        }
    }
}

