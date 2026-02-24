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
            // ============================
            // 🔥 Super Admin
            // ============================

            var superAdminEmail = "superadmin@medscope.com";
            var existingSuperAdmin = await userManager.FindByEmailAsync(superAdminEmail);

            if (existingSuperAdmin == null)
            {
                var superAdminUser = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    FirstName = "System",
                    LastName = "SuperAdmin",
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(superAdminUser, "SuperAdmin@123");

                if (!createResult.Succeeded)
                {
                    foreach (var error in createResult.Errors)
                    {
                        Console.WriteLine(error.Description);
                    }
                    return;
                }

                var roleResult = await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");

                if (!roleResult.Succeeded)
                {
                    foreach (var error in roleResult.Errors)
                    {
                        Console.WriteLine(error.Description);
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
    }
}
