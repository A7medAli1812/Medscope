using MedScope.Application.Interfaces;
using MedScope.Application.Features.Auth;
using MedScope.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace MedScope.Infrastructure.Services
{
    internal class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(IServiceCollection services)
        {
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ForgotPasswordHandler>();
            services.AddScoped<ResetPasswordHandler>();

            return services;
        }
    }
}