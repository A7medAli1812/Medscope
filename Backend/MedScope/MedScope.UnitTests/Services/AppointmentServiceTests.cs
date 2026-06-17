using FluentAssertions;
using MedScope.Application.DTOs.Admin;
using MedScope.Domain.Entities;
using MedScope.Domain.Enums;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.UnitTests.Services
{
    public class AppointmentServiceTests
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
        public async Task CreateAppointmentAsync_ShouldThrowException_WhenBookingInThePast()
        {
            // Arrange
            var context = await GetDbContext();
            
            // Seed data
            var doctor = new Doctor { Id = 1, HospitalId = 1, UserId = "doc1" };
            var patient = new Patient { Id = 1, UserId = "pat1" };
            
            context.Doctors.Add(doctor);
            context.Patients.Add(patient);
            await context.SaveChangesAsync();

            var service = new AppointmentService(context);

            var dto = new AdminCreateAppointmentDto
            {
                DoctorId = 1,
                PatientId = 1,
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(-1)), // Past date
                Time = "10:00 AM",
                PatientAge = 30,
                VisitType = "FollowUp"
            };

            // Act
            Func<Task> act = async () => await service.CreateAppointmentAsync(dto, 1);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Cannot book appointment in the past");
        }

        [Fact]
        public async Task CreateAppointmentAsync_ShouldThrowException_WhenSlotIsBooked()
        {
            // Arrange
            var context = await GetDbContext();
            
            var futureDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
            
            var doctor = new Doctor { Id = 1, HospitalId = 1, UserId = "doc1" };
            var patient = new Patient { Id = 1, UserId = "pat1" };
            
            context.Doctors.Add(doctor);
            context.Patients.Add(patient);

            // Existing appointment
            var existingAppointment = new Appointment
            {
                PatientId = 1,
                DoctorId = 1,
                Date = futureDate,
                Time = new TimeOnly(10, 0),
                Status = AppointmentStatus.New,
                VisitType = "FollowUp",
                HospitalId = 1
            };
            context.Appointments.Add(existingAppointment);
            await context.SaveChangesAsync();

            var service = new AppointmentService(context);

            var dto = new AdminCreateAppointmentDto
            {
                DoctorId = 1,
                PatientId = 1,
                Date = futureDate,
                Time = "10:00", // Same time
                PatientAge = 30,
                VisitType = "FollowUp"
            };

            // Act
            Func<Task> act = async () => await service.CreateAppointmentAsync(dto, 1);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("This time slot is already booked");
        }

        [Fact]
        public async Task CreateAppointmentAsync_ShouldThrowException_WhenBookingOutsideWorkingHours()
        {
            // Arrange
            var context = await GetDbContext();
            
            var futureDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
            var dayOfWeek = futureDate.DayOfWeek.ToString().ToLower().Trim();
            
            var doctor = new Doctor { Id = 1, HospitalId = 1, UserId = "doc1" };
            var patient = new Patient { Id = 1, UserId = "pat1" };
            
            context.Doctors.Add(doctor);
            context.Patients.Add(patient);

            // Working hours: 9 AM to 5 PM
            var workingHours = new DoctorWorkingHours
            {
                DoctorId = 1,
                Day = dayOfWeek,
                From = new TimeSpan(9, 0, 0),
                To = new TimeSpan(17, 0, 0)
            };
            context.DoctorWorkingHours.Add(workingHours);

            await context.SaveChangesAsync();

            var service = new AppointmentService(context);

            var dto = new AdminCreateAppointmentDto
            {
                DoctorId = 1,
                PatientId = 1,
                Date = futureDate,
                Time = "18:00", // 6 PM is outside working hours
                PatientAge = 30,
                VisitType = "FollowUp"
            };

            // Act
            Func<Task> act = async () => await service.CreateAppointmentAsync(dto, 1);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Appointment outside doctor working hours");
        }
    }
}
