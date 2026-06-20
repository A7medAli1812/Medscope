using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.Features.SuperAdmin;
using MedScope.Application.Features.Auth; // ✅ ضيف دي
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using System.Reflection;

namespace MedScope.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationLayer(
            this IServiceCollection services)
        {
            // 🔥 MediatR
            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // =========================
            // Services
            // =========================
            services.AddScoped<ISuperAdminService, SuperAdminService>();

            // =========================
            // Auth Handlers ✅
            // =========================
            services.AddScoped<VerifyOtpHandler>();

            return services;
        }
    }
}