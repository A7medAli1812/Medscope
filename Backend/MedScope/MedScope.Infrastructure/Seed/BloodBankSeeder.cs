using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Seed
{
    public static class BloodBankSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            var bloodTypes = new List<string>
    {
        "A+","A-","B+","B-","AB+","AB-","O+","O-"
    };

            var hospitals = await context.Hospitals.ToListAsync();

            foreach (var hospital in hospitals)
            {
                var existingRecords = await context.BloodBanks
                    .Where(x => x.HospitalId == hospital.Id)
                    .ToListAsync();

                foreach (var type in bloodTypes)
                {
                    var record = existingRecords
                        .FirstOrDefault(x => x.BloodType == type);

                    if (record == null)
                    {
                        // 👈 يضيف الناقص بس
                        context.BloodBanks.Add(new BloodBank
                        {
                            BloodType = type,
                            Quantity = 0,
                            HospitalId = hospital.Id
                        });
                    }
                    else
                    {
                        // 👈 (اختياري) نعدل لو فيه مشكلة
                        if (record.Quantity < 0)
                            record.Quantity = 0;
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
