using MedScope.Application.Abstractions.Blood;
using MedScope.Application.DTOs.BloodBank;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services
{
    public class BloodBankService : IBloodBankService
    {
        private readonly ApplicationDbContext _context;

        public BloodBankService(ApplicationDbContext context)
        {
            _context = context;
        }

        // =============================
        // Get All Blood Types (Per Hospital)
        // =============================
        public async Task<List<BloodBankDto>> GetAllAsync(int hospitalId)
        {
            var data = await _context.BloodBanks
                .Where(x => x.HospitalId == hospitalId)
                .Select(x => new BloodBankDto
                {
                    Id = x.Id,
                    BloodType = x.BloodType,
                    Quantity = x.Quantity
                })
                .ToListAsync();   // هنا خلصنا SQL

            // هنا بقى C# عادي
            foreach (var item in data)
            {
                item.Status = GetStatus(item.Quantity);
            }

            return data;
        }

        // =============================
        // Add New Blood Type
        // =============================
        public async Task AddAsync(CreateBloodBankDto dto, int hospitalId)
        {
            // 🔒 Null check
            if (dto == null)
                throw new Exception("Invalid request");

            // 🔒 Validation
            if (string.IsNullOrWhiteSpace(dto.BloodType))
                throw new Exception("Blood type is required");

            if (dto.Quantity < 0)
                throw new Exception("Quantity cannot be negative");

            // 🔥 Normalize input (مهم جدًا)
            var normalizedBloodType = dto.BloodType.Trim().ToUpper();

            // 🔍 Check duplicate (after normalize)
            var exists = await _context.BloodBanks
                .AnyAsync(x => x.BloodType == normalizedBloodType
                            && x.HospitalId == hospitalId);

            if (exists)
                throw new Exception("Blood type already exists for this hospital");

            var entity = new BloodBank
            {
                BloodType = normalizedBloodType,
                Quantity = dto.Quantity,
                HospitalId = hospitalId
            };

            await _context.BloodBanks.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        // =============================
        // Increase Quantity (Secure)
        // =============================
        public async Task IncreaseAsync(int id, int hospitalId)
        {
            var blood = await _context.BloodBanks
                .FirstOrDefaultAsync(x => x.Id == id && x.HospitalId == hospitalId);

            if (blood == null)
                throw new Exception("Blood type not found for this hospital");

            blood.Quantity++;

            await _context.SaveChangesAsync();
        }

        // =============================
        // Decrease Quantity (Secure)
        // =============================
        public async Task DecreaseAsync(int id, int hospitalId)
        {
            var blood = await _context.BloodBanks
                .FirstOrDefaultAsync(x => x.Id == id && x.HospitalId == hospitalId);

            if (blood == null)
                throw new Exception("Blood type not found for this hospital");

            if (blood.Quantity == 0)
                throw new Exception("Quantity already zero");

            blood.Quantity--;

            await _context.SaveChangesAsync();
        }

        // =============================
        // Status Logic
        // =============================
        private string GetStatus(int quantity)
        {
            if (quantity == 0)
                return "Out Of Stock";

            if (quantity <= 10)
                return "Low Stock";

            return "In Stock";
        }
    }
}