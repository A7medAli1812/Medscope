using MedScope.Application.DTOs;
using MedScope.Application.DTOs.Patient;
using MedScope.Application.Interfaces;
using MedScope.Domain.Enums;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public PatientService(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // =========================
    // GET ALL PATIENTS
    // =========================
    public async Task<object> GetPatientsAsync(PatientQueryParams query)
    {
        var patientsQuery = from p in _context.Patients
                            join u in _context.Users
                            on p.UserId equals u.Id
                            where !p.IsDeleted
                            select new
                            {
                                p.Id,
                                p.BloodGroup,
                                u.FirstName,
                                u.LastName,
                                u.Email,
                                u.PhoneNumber,
                                u.Gender,
                                u.DateOfBirth
                            };

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            patientsQuery = patientsQuery.Where(x =>
                x.FirstName.Contains(query.Search) ||
                x.LastName.Contains(query.Search) ||
                x.Email.Contains(query.Search));
        }

        if (!string.IsNullOrWhiteSpace(query.Gender) &&
            Enum.TryParse<Gender>(query.Gender, true, out var genderEnum))
        {
            patientsQuery = patientsQuery.Where(x => x.Gender == genderEnum);
        }

        var totalCount = await patientsQuery.CountAsync();

        var data = await patientsQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new PatientDto
            {
                Id = x.Id,
                FullName = x.FirstName + " " + x.LastName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                Gender = x.Gender.ToString(),
                DateOfBirth = x.DateOfBirth,
                BloodGroup = x.BloodGroup
            })
            .ToListAsync();

        return new
        {
            data,
            totalCount,
            page = query.Page,
            pageSize = query.PageSize
        };
    }

    // =========================
    // UPDATE PATIENT
    // =========================
    public async Task<bool> UpdatePatientAsync(int patientId, UpdatePatientDto dto)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == patientId);

        if (patient == null)
            return false;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == patient.UserId);

        if (user == null)
            return false;

        if (!string.IsNullOrEmpty(dto.FirstName))
            user.FirstName = dto.FirstName;

        if (!string.IsNullOrEmpty(dto.LastName))
            user.LastName = dto.LastName;

        if (!string.IsNullOrEmpty(dto.Email))
            user.Email = dto.Email;

        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            user.PhoneNumber = dto.PhoneNumber;

        if (!string.IsNullOrEmpty(dto.Gender))
        {
            if (Enum.TryParse<Gender>(dto.Gender, out var gender))
                user.Gender = gender;
        }

        if (dto.DateOfBirth.HasValue)
            user.DateOfBirth = dto.DateOfBirth.Value;

        if (!string.IsNullOrEmpty(dto.BloodGroup))
            patient.BloodGroup = dto.BloodGroup;

        patient.LastModifiedAt = DateTime.UtcNow;
        patient.LastModifiedBy = "Admin";

        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // DELETE (SOFT)
    // =========================
    public async Task<bool> DeletePatientAsync(int patientId)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == patientId);

        if (patient == null)
            return false;

        patient.IsDeleted = true;

        patient.LastModifiedAt = DateTime.UtcNow;
        patient.LastModifiedBy = "Admin";

        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // GET BY ID
    // =========================
    public async Task<PatientDetailsDto?> GetPatientByIdAsync(int id)
    {
        var patient = await (from p in _context.Patients
                             join u in _context.Users
                             on p.UserId equals u.Id
                             where p.Id == id && !p.IsDeleted
                             select new PatientDetailsDto
                             {
                                 Id = p.Id,
                                 FirstName = u.FirstName,
                                 LastName = u.LastName,
                                 Email = u.Email,
                                 PhoneNumber = u.PhoneNumber,
                                 Gender = u.Gender.ToString(),
                                 DateOfBirth = u.DateOfBirth,
                                 BloodGroup = p.BloodGroup
                             }).FirstOrDefaultAsync();

        return patient;
    }

    // =========================
    // GET PROFILE
    // =========================
    public async Task<PatientProfileDto> GetProfileAsync(string userId)
    {
        var profile = await (from p in _context.Patients
                             join u in _context.Users
                             on p.UserId equals u.Id
                             where p.UserId == userId && !p.IsDeleted
                             select new PatientProfileDto
                             {
                                 FullName = u.FirstName + " " + u.LastName,
                                 Email = u.Email,
                                 PhoneNumber = u.PhoneNumber,
                                 Address = u.Address,
                                 BloodGroup = p.BloodGroup,

                                 PatientId = p.Id,
                                 RegistrationDate = u.CreatedAt,
                                 AccountStatus = "Active",
                                 LastLogin = u.LastLogin,

                                 EmailNotifications = u.EmailNotifications,
                                 AppointmentReminders = u.AppointmentReminders
                             }).FirstOrDefaultAsync();

        return profile;
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    public async Task<bool> UpdateProfileAsync(string userId, UpdatePatientProfileDto dto)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.UserId == userId && !p.IsDeleted);

        if (patient == null)
            return false;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return false;

        if (!string.IsNullOrEmpty(dto.FirstName))
            user.FirstName = dto.FirstName;

        if (!string.IsNullOrEmpty(dto.LastName))
            user.LastName = dto.LastName;

        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            user.PhoneNumber = dto.PhoneNumber;

        if (!string.IsNullOrEmpty(dto.Address))
            user.Address = dto.Address;

        if (!string.IsNullOrEmpty(dto.BloodGroup))
            patient.BloodGroup = dto.BloodGroup;

        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // UPDATE NOTIFICATIONS
    // =========================
    public async Task<bool> UpdateNotificationSettingsAsync(string userId, UpdateNotificationSettingsDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return false;

        user.EmailNotifications = dto.EmailNotifications;
        user.AppointmentReminders = dto.AppointmentReminders;

        await _context.SaveChangesAsync();

        return true;
    }

    // =========================
    // CHANGE PASSWORD
    // =========================
    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return false;

        var result = await _userManager.ChangePasswordAsync(
            user,
            dto.CurrentPassword,
            dto.NewPassword
        );

        return result.Succeeded;
    }
    // =========================
    // DELETE ACCOUNT (SOFT DELETE)
    // =========================
    public async Task<bool> DeleteAccountAsync(string userId)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.UserId == userId && !p.IsDeleted);

        if (patient == null)
            return false;

        patient.IsDeleted = true;

        await _context.SaveChangesAsync();

        return true;
    }
}