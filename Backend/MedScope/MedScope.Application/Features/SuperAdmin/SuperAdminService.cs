using MedScope.Application.Abstractions.Persistence;
using MedScope.Application.Abstractions.SuperAdmin;
using MedScope.Application.DTOs.SuperAdmin;
using MedScope.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Application.Features.SuperAdmin
{
    public class SuperAdminService : ISuperAdminService
    {
        private readonly IApplicationDbContext _context;

        public SuperAdminService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateHospitalAsync(CreateHospitalDto dto)
        {
            // =========================
            // Basic Validation
            // =========================
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception("Hospital name is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new Exception("Hospital email is required.");

            // =========================
            // Business Rules Validation
            // =========================

            var numberExists = await _context.Hospitals
                .AnyAsync(h => h.HospitalNumber == dto.HospitalNumber);

            if (numberExists)
                throw new Exception("Hospital number already exists.");

            var emailExists = await _context.Hospitals
                .AnyAsync(h => h.Email == dto.Email);

            if (emailExists)
                throw new Exception("Hospital email already exists.");

            // =========================
            // Create Hospital
            // =========================

            var hospital = new Hospital
            {
                Name = dto.Name,
                Type = dto.Type,
                HospitalNumber = dto.HospitalNumber,
                Phone = dto.Phone,
                Email = dto.Email,
                Website = dto.Website
            };

            await _context.Hospitals.AddAsync(hospital);
            await _context.SaveChangesAsync();
        }
    }
}