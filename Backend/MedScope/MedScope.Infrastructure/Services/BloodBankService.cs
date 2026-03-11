using MedScope.Application.Abstractions.Blood;
using MedScope.Application.DTOs.BloodBank;
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

        // =========================================
        // Get All Blood Types For Specific Hospital
        // =========================================
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
                .ToListAsync();

            foreach (var item in data)
            {
                item.Status = GetStatus(item.Quantity);
            }

            return data;
        }

        // =========================================
        // Get Blood Banks For ALL Hospitals (Patient View)
        // =========================================
        public async Task<List<HospitalBloodBankDto>> GetAllHospitalsBloodAsync()
        {
            var hospitals = await _context.Hospitals
                .Include(h => h.BloodBanks)
                .ToListAsync();

            var result = hospitals.Select(h => new HospitalBloodBankDto
            {
                HospitalId = h.Id,
                HospitalName = h.Name,
                Address = h.Address,
                Phone = h.Phone,

                BloodTypes = h.BloodBanks.Select(b => new BloodBankDto
                {
                    Id = b.Id,
                    BloodType = b.BloodType,
                    Quantity = b.Quantity,
                    Status = GetStatus(b.Quantity)
                }).ToList()

            }).ToList();

            return result;
        }

        // =========================================
        // Increase Quantity
        // =========================================
        public async Task IncreaseAsync(int id, int hospitalId)
        {
            var blood = await _context.BloodBanks
                .FirstOrDefaultAsync(x => x.Id == id && x.HospitalId == hospitalId);

            if (blood == null)
                throw new Exception("Blood type not found for this hospital");

            blood.Quantity++;

            await _context.SaveChangesAsync();
        }

        // =========================================
        // Decrease Quantity
        // =========================================
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

        // =========================================
        // Status Logic
        // =========================================
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