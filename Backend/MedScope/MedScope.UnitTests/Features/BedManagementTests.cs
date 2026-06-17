using FluentAssertions;
using MediatR;
using MedScope.Application.Features.BedManagement;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.UnitTests.Features.BedManagement
{
    public class BedManagementTests
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
        public async Task IncreaseBedCommandHandler_ShouldIncreaseBedCount()
        {
            // Arrange
            var context = await GetDbContext();
            var bed = new Bed { Id = 1, AvailableBeds = 5, TotalBeds = 10, Name = "ICU", HospitalId = 1 };
            context.Beds.Add(bed);
            await context.SaveChangesAsync();

            var handler = new IncreaseBedCommandHandler(context);
            var command = new IncreaseBedCommand(1);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            var updatedBed = await context.Beds.FindAsync(1);
            updatedBed.AvailableBeds.Should().Be(6);
        }

        [Fact]
        public async Task DecreaseBedCommandHandler_ShouldDecreaseBedCount()
        {
            // Arrange
            var context = await GetDbContext();
            var bed = new Bed { Id = 1, AvailableBeds = 5, TotalBeds = 10, Name = "ICU", HospitalId = 1 };
            context.Beds.Add(bed);
            await context.SaveChangesAsync();

            var handler = new DecreaseBedCommandHandler(context);
            var command = new DecreaseBedCommand(1);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            var updatedBed = await context.Beds.FindAsync(1);
            updatedBed.AvailableBeds.Should().Be(4);
        }
    }
}
