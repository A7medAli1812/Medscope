using MedScope.Application.Interfaces;
using MedScope.Application.Abstractions.Appointments;
using MedScope.Infrastructure.Identity;
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

            return services;
        }
    }
}

