using FluentAssertions;
using MedScope.Application.DTOs.Auth;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.UnitTests.Services
{
    public class AuthServiceTests
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

        private Mock<UserManager<ApplicationUser>> MockUserManager()
        {
            var store = new Mock<IUserStore<ApplicationUser>>();
            return new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private Mock<RoleManager<IdentityRole>> MockRoleManager()
        {
            var store = new Mock<IRoleStore<IdentityRole>>();
            return new Mock<RoleManager<IdentityRole>>(store.Object, null, null, null, null);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnError_WhenPasswordMismatch()
        {
            // Arrange
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();
            var context = await GetDbContext();
            
            var user = new ApplicationUser { Email = "test@test.com", Id = "user1" };
            userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com")).ReturnsAsync(user);
            userManagerMock.Setup(x => x.CheckPasswordAsync(user, "wrongpassword")).ReturnsAsync(false);

            var service = new AuthService(userManagerMock.Object, roleManagerMock.Object, context, null);

            var dto = new LoginDto { Email = "test@test.com", Password = "wrongpassword" };

            // Act
            var result = await service.LoginAsync(dto);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be("Invalid email or password");
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnError_WhenDuplicateEmail()
        {
            // Arrange
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();
            var context = await GetDbContext();
            
            var user = new ApplicationUser { Email = "duplicate@test.com", Id = "user1" };
            userManagerMock.Setup(x => x.FindByEmailAsync("duplicate@test.com")).ReturnsAsync(user);

            var service = new AuthService(userManagerMock.Object, roleManagerMock.Object, context, null);

            var dto = new RegisterDto
            {
                Email = "duplicate@test.com",
                Password = "Password123",
                ConfirmPassword = "Password123"
            };

            // Act
            var result = await service.RegisterAsync(dto);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be("Email already registered");
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnError_WhenAccountIsSoftDeleted()
        {
            // Arrange
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();
            var context = await GetDbContext();
            
            var user = new ApplicationUser { Email = "deleted@test.com", Id = "user2" };
            userManagerMock.Setup(x => x.FindByEmailAsync("deleted@test.com")).ReturnsAsync(user);
            userManagerMock.Setup(x => x.CheckPasswordAsync(user, "password")).ReturnsAsync(true);

            var patient = new Patient { UserId = "user2", IsDeleted = true };
            context.Patients.Add(patient);
            await context.SaveChangesAsync();

            var service = new AuthService(userManagerMock.Object, roleManagerMock.Object, context, null);

            var dto = new LoginDto { Email = "deleted@test.com", Password = "password" };

            // Act
            var result = await service.LoginAsync(dto);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be("This account has been deleted");
        }
    }
}
