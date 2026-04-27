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
            // Validation
            // =========================
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception("Hospital name is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new Exception("Hospital email is required.");

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
                Website = dto.Website,
                City = dto.City,
                Address = dto.Address
            };

            await _context.Hospitals.AddAsync(hospital);

            // الأقسام الافتراضية
            var sections = new List<string>
{
    "ICU",
    "Emergency",
    "Pediatric",
    "Operating Room (OR) Beds"
};

            // إضافة الأقسام
            foreach (var section in sections)
            {
                _context.Beds.Add(new Bed
                {
                    Name = section,
                    Hospital = hospital,
                    TotalBeds = 0,
                    AvailableBeds = 0
                });
            }

            // 🔥 نجيب التخصصات
            var specialties = await _context.Specialties.ToListAsync();

            // 🔥 نربط التخصصات بالمستشفى
            var hospitalSpecialties = specialties.Select(s => new HospitalSpecialty
            {
                Hospital = hospital, // 👈 دي أحسن من HospitalId
                SpecialtyId = s.Id
            }).ToList();

            _context.HospitalSpecialties.AddRange(hospitalSpecialties);

            //  حفظ مرة واحدة بس لكل حاجة
            await _context.SaveChangesAsync();
        }
    }
}