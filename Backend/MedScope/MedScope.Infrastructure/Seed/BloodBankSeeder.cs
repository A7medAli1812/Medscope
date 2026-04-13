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

            foreach (var hospital in context.Hospitals)
            {
                foreach (var type in bloodTypes)
                {
                    bool exists = await context.BloodBanks
                        .AnyAsync(x => x.HospitalId == hospital.Id && x.BloodType == type);

                    if (!exists)
                    {
                        context.BloodBanks.Add(new BloodBank
                        {
                            BloodType = type,
                            Quantity = 0,
                            HospitalId = hospital.Id
                        });
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
