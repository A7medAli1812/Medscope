using FluentAssertions;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.UnitTests.Services
{
    public class BloodBankServiceTests
    {
        private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return context;
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnCorrectStatusMapping()
        {
            // Arrange
            var context = await GetDbContext();
            
            context.BloodBanks.AddRange(
                new BloodBank { Id = 1, HospitalId = 1, BloodType = "A+", Quantity = 0 },
                new BloodBank { Id = 2, HospitalId = 1, BloodType = "B+", Quantity = 5 },
                new BloodBank { Id = 3, HospitalId = 1, BloodType = "O+", Quantity = 15 }
            );
            await context.SaveChangesAsync();

            var service = new BloodBankService(context);

            // Act
            var result = await service.GetAllAsync(1);

            // Assert
            result.Should().HaveCount(3);
            result.Should().ContainSingle(x => x.BloodType == "A+" && x.Status == "Out Of Stock");
            result.Should().ContainSingle(x => x.BloodType == "B+" && x.Status == "Low Stock");
            result.Should().ContainSingle(x => x.BloodType == "O+" && x.Status == "In Stock");
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnOnlyBloodBanksForSpecificHospital()
        {
            // Arrange
            var context = await GetDbContext();
            
            context.BloodBanks.AddRange(
                new BloodBank { Id = 1, HospitalId = 1, BloodType = "A+", Quantity = 10 },
                new BloodBank { Id = 2, HospitalId = 2, BloodType = "B+", Quantity = 10 }
            );
            await context.SaveChangesAsync();

            var service = new BloodBankService(context);

            // Act
            var result = await service.GetAllAsync(1);

            // Assert
            result.Should().HaveCount(1);
            result.First().BloodType.Should().Be("A+");
        }
    }
}
