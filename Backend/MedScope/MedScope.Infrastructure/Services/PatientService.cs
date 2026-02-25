using MedScope.Application.DTOs;
using MedScope.Application.Interfaces;
using MedScope.Domain.Enums;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;

    public PatientService(ApplicationDbContext context)
    {
        _context = context;
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

        // 🔍 Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            patientsQuery = patientsQuery.Where(x =>
                x.FirstName.Contains(query.Search) ||
                x.LastName.Contains(query.Search) ||
                x.Email.Contains(query.Search));
        }

        // 📅 Filter by Gender 🔥
        if (!string.IsNullOrWhiteSpace(query.Gender) &&
     Enum.TryParse<Gender>(query.Gender, true, out var genderEnum))
        {
            patientsQuery = patientsQuery.Where(x => x.Gender == genderEnum);
        }

        // 📊 Total Count
        var totalCount = await patientsQuery.CountAsync();

        // 📄 Pagination + DTO
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
    // UPDATE PATIENT 🔥
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

        // UPDATE USER (Partial)
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

        // UPDATE PATIENT
        if (!string.IsNullOrEmpty(dto.BloodGroup))
            patient.BloodGroup = dto.BloodGroup;

        // AUDIT
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
}