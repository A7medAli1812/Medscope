using FluentAssertions;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using MedScope.WebApi.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.UnitTests.Controllers
{
    public class DoctorControllerTests
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
        public async Task GetDoctors_ShouldReturnDoctorsForSpecificHospital()
        {
            // Arrange
            var context = await GetDbContext();
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();

            // Seed Data
            var user1 = new ApplicationUser { Id = "user1", FirstName = "John", LastName = "Doe", Email = "j@d.com" };
            var user2 = new ApplicationUser { Id = "user2", FirstName = "Jane", LastName = "Smith", Email = "j@s.com" };
            
            context.Users.AddRange(user1, user2);
            
            var specialty = new Specialty { Id = 1, Name = "Cardiology" };
            context.Specialties.Add(specialty);

            var doctor1 = new Doctor { Id = 1, UserId = "user1", HospitalId = 1, SpecialtyId = 1, IsDeleted = false, Specialty = specialty };
            var doctor2 = new Doctor { Id = 2, UserId = "user2", HospitalId = 2, SpecialtyId = 1, IsDeleted = false, Specialty = specialty };

            context.Doctors.AddRange(doctor1, doctor2);
            await context.SaveChangesAsync();

            var controller = new DoctorController(userManagerMock.Object, roleManagerMock.Object, context);

            // Mock User context
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("HospitalId", "1")
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await controller.GetDoctors(1, 10, null, null);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            // Due to anonymous type in the actual controller, we just verify count dynamically
            var dataProperty = okResult.Value.GetType().GetProperty("data");
            var dataList = dataProperty.GetValue(okResult.Value, null) as IEnumerable<object>;
            
            var totalCountProperty = okResult.Value.GetType().GetProperty("totalCount");
            var totalCount = (int)totalCountProperty.GetValue(okResult.Value, null);

            totalCount.Should().Be(1);
            
            // First item should be doc1
            var enumerator = dataList.GetEnumerator();
            enumerator.MoveNext();
            var docData = enumerator.Current;
            var docId = (int)docData.GetType().GetProperty("DoctorId").GetValue(docData, null);
            docId.Should().Be(1);
        }

        [Fact]
        public async Task GetDoctors_ShouldFilterOutSoftDeletedDoctors()
        {
            // Arrange
            var context = await GetDbContext();
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();

            // Seed Data
            var user1 = new ApplicationUser { Id = "user1", FirstName = "John", LastName = "Doe", Email = "j@d.com" };
            var user2 = new ApplicationUser { Id = "user2", FirstName = "Jane", LastName = "Smith", Email = "j@s.com" };
            
            context.Users.AddRange(user1, user2);
            
            var specialty = new Specialty { Id = 1, Name = "Cardiology" };
            context.Specialties.Add(specialty);

            var doctor1 = new Doctor { Id = 1, UserId = "user1", HospitalId = 1, SpecialtyId = 1, IsDeleted = false, Specialty = specialty };
            var doctor2 = new Doctor { Id = 2, UserId = "user2", HospitalId = 1, SpecialtyId = 1, IsDeleted = true, Specialty = specialty };

            context.Doctors.AddRange(doctor1, doctor2);
            await context.SaveChangesAsync();

            var controller = new DoctorController(userManagerMock.Object, roleManagerMock.Object, context);

            // Mock User context
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("HospitalId", "1")
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await controller.GetDoctors(1, 10, null, null);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            var totalCountProperty = okResult.Value.GetType().GetProperty("totalCount");
            var totalCount = (int)totalCountProperty.GetValue(okResult.Value, null);

            totalCount.Should().Be(1);
            
            var dataProperty = okResult.Value.GetType().GetProperty("data");
            var dataList = dataProperty.GetValue(okResult.Value, null) as IEnumerable<object>;
            var enumerator = dataList.GetEnumerator();
            enumerator.MoveNext();
            var docData = enumerator.Current;
            var docId = (int)docData.GetType().GetProperty("DoctorId").GetValue(docData, null);
            docId.Should().Be(1);
        }
    }
}
