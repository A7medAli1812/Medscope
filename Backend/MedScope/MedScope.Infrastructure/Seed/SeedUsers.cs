using MedScope.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MedScope.Infrastructure.Seed
{
    public static class SeedUsers
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager)
        {
            // ===== Admin =====
            var adminEmail = "admin@medscope.com";
            var admin = await userManager.FindByEmailAsync(adminEmail);

            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "System",
                    LastName = "Admin",
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(admin, "Admin@123");
                await userManager.AddToRoleAsync(admin, "Admin");
            }

            // ===== Doctor =====
            var doctorEmail = "doctor@medscope.com";
            var doctor = await userManager.FindByEmailAsync(doctorEmail);

            if (doctor == null)
            {
                doctor = new ApplicationUser
                {
                    UserName = doctorEmail,
                    Email = doctorEmail,
                    FirstName = "Default",
                    LastName = "Doctor",
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(doctor, "Doctor@123");
                await userManager.AddToRoleAsync(doctor, "Doctor");
            }
        }
    }
}
