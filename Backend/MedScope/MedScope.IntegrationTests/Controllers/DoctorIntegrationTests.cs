using FluentAssertions;
using MedScope.Application.DTOs.Auth;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.IntegrationTests.Controllers
{
    public class DoctorIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public DoctorIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetDoctors_ShouldReturnUnauthorized_WhenNoToken()
        {
            // Act
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/doctor");

            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetDoctors_ShouldReturnOnlyDoctorsForHospitalA_WhenLoggedInAsAdminOfHospitalA()
        {
            // Arrange: Create a custom factory with InMemory database
            var customFactory = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    var descriptors = services.Where(d => 
                        d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) || 
                        d.ServiceType == typeof(DbContextOptions)).ToList();
                    
                    foreach (var descriptor in descriptors)
                    {
                        services.Remove(descriptor);
                    }

                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseInMemoryDatabase("TenantIsolationTestDb"));
                });
            });

            using var scope = customFactory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Clean database if running multiple times
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Seed Roles
            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            if (!await roleManager.RoleExistsAsync("Doctor"))
                await roleManager.CreateAsync(new IdentityRole("Doctor"));

            // Seed Hospitals
            var hospitalA = new Hospital { Id = 1, Name = "Hospital A", Address = "123", City = "City", Email = "a@a.com", Phone = "123", Website = "a.com", Type = "General", HospitalNumber = 100 };
            var hospitalB = new Hospital { Id = 2, Name = "Hospital B", Address = "123", City = "City", Email = "b@b.com", Phone = "123", Website = "b.com", Type = "General", HospitalNumber = 200 };
            context.Hospitals.AddRange(hospitalA, hospitalB);

            // Seed Specialty
            var specialty = new Specialty { Id = 1, Name = "Cardiology" };
            context.Specialties.Add(specialty);

            await context.SaveChangesAsync();

            // Seed Admin User for Hospital A
            var adminUser = new ApplicationUser { UserName = "adminA@test.com", Email = "adminA@test.com", FirstName = "Admin", LastName = "A" };
            await userManager.CreateAsync(adminUser, "Password123!");
            await userManager.AddToRoleAsync(adminUser, "Admin");

            context.Admins.Add(new Admin { UserId = adminUser.Id, HospitalId = hospitalA.Id });

            // Seed Doctor for Hospital A
            var doctorUserA = new ApplicationUser { UserName = "docA@test.com", Email = "docA@test.com", FirstName = "Doctor", LastName = "A" };
            await userManager.CreateAsync(doctorUserA, "Password123!");
            await userManager.AddToRoleAsync(doctorUserA, "Doctor");

            context.Doctors.Add(new Doctor { UserId = doctorUserA.Id, HospitalId = hospitalA.Id, SpecialtyId = specialty.Id });

            // Seed Doctor for Hospital B
            var doctorUserB = new ApplicationUser { UserName = "docB@test.com", Email = "docB@test.com", FirstName = "Doctor", LastName = "B" };
            await userManager.CreateAsync(doctorUserB, "Password123!");
            await userManager.AddToRoleAsync(doctorUserB, "Doctor");

            context.Doctors.Add(new Doctor { UserId = doctorUserB.Id, HospitalId = hospitalB.Id, SpecialtyId = specialty.Id });

            await context.SaveChangesAsync();

            var client = customFactory.CreateClient();

            // Act 1: Login as Admin of Hospital A
            var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new LoginDto
            {
                Email = "adminA@test.com",
                Password = "Password123!"
            });

            loginResponse.EnsureSuccessStatusCode();
            var loginResult = await loginResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
            var token = loginResult!.Token;

            // Act 2: Fetch Doctors
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            var doctorsResponse = await client.GetAsync("/api/doctor");

            doctorsResponse.EnsureSuccessStatusCode();

            var responseBody = await doctorsResponse.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseBody);
            var dataArray = jsonDoc.RootElement.GetProperty("data");

            // Assert
            var totalCount = jsonDoc.RootElement.GetProperty("totalCount").GetInt32();
            totalCount.Should().Be(1, "Only Doctor A belongs to Hospital A");

            var doctorsList = dataArray.EnumerateArray().ToList();
            doctorsList.Should().HaveCount(1);
            doctorsList[0].GetProperty("email").GetString().Should().Be("docA@test.com");

            // Explicitly verify Doctor B does not appear
            foreach (var doc in doctorsList)
            {
                doc.GetProperty("email").GetString().Should().NotBe("docB@test.com");
            }
        }
    }
}
