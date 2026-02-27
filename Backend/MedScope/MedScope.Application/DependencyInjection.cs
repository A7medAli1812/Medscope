using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.Features.SuperAdmin;
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
            // 🔥 تسجيل MediatR
            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // Services
            services.AddScoped<ISuperAdminService, SuperAdminService>();

            return services;
        }
    }
}