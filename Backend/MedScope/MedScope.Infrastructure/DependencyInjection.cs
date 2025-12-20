using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MedScope.Application.Abstractions.Appointments;
namespace MedScope.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureLayer(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Auth Service
            services.AddScoped<IAuthService, AuthService>();

            // Auth Service
            services.AddScoped<IAuthService, AuthService>();

            // Appointment Service ✅ (ضيفي ده)
            services.AddScoped<IAppointmentService, AppointmentService>();

            // JWT Settings
            services.Configure<AuthSettings>(
                configuration.GetSection("AuthSettings"));

            // JWT Generator
            services.AddScoped<JwtTokenGenerator>();


            // 🔐 JWT Settings
            services.Configure<AuthSettings>(
                configuration.GetSection("AuthSettings"));

            // 🔐 JWT Generator
            services.AddScoped<JwtTokenGenerator>();

            return services;
        }
    }
}
