using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.Features.SuperAdmin;
using Microsoft.Extensions.DependencyInjection;

namespace MedScope.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationLayer(
            this IServiceCollection services)
        {
            services.AddScoped<ISuperAdminService, SuperAdminService>();

            return services;
        }
    }

}