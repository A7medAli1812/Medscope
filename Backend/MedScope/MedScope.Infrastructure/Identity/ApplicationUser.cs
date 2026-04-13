using MedScope.Application.Interfaces;
using MedScope.Domain.Enums;
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLogin { get; set; }

    public bool EmailNotifications { get; set; } = true;
    public bool AppointmentReminders { get; set; } = true;
}