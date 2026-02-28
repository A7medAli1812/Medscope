using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MedScope.Application.DTOs.BloodBank;



namespace MedScope.Application.Abstractions.Blood
{
    public interface IBloodBankService
    {
        // عرض كل أنواع الدم الخاصة بمستشفى معينة
        Task<List<BloodBankDto>> GetAllAsync(int hospitalId);

        // إضافة نوع دم جديد
        Task AddAsync(CreateBloodBankDto dto, int hospitalId);

        // زيادة الكمية (Arrow Up)
        Task IncreaseAsync(int id, int hospitalId);
        Task DecreaseAsync(int id, int hospitalId);
    }
}
