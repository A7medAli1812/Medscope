using MedScope.Application.DTOs.Common;
using MedScope.Application.DTOs.Doctor;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MedScope.Application.Interfaces.Doctor;

namespace MedScope.Infrastructure.Services.Doctor
{
    public class DoctorPatientsService : IDoctorPatientsListService
    {
        private readonly ApplicationDbContext _context;

        public DoctorPatientsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DoctorPatientRowDto>> GetDoctorPatients(
            string doctorUserId,
            DoctorPatientsQuery query)
        {
            // 1️⃣ احضر Ids المرضى الذين لديهم مواعيد مع هذا الدكتور
            var patientIds = await _context.Appointments
                .Where(a => a.Doctor.UserId == doctorUserId)
                .Select(a => a.PatientId)
                .Distinct()
                .ToListAsync();

            // 2️⃣ Join بين Patients و Users
            var patientsQuery =
                from p in _context.Patients
                join u in _context.Users on p.UserId equals u.Id
                where patientIds.Contains(p.Id) && !p.IsDeleted
                select new DoctorPatientRowDto
                {
                    PatientId = p.Id,
                    FullName = u.FirstName + " " + u.LastName,
                    Gender = u.Gender.ToString(),
                    BloodGroup = p.BloodGroup,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Age = DateTime.Now.Year - u.DateOfBirth.Year
                };

            // 3️⃣ Search
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                patientsQuery = patientsQuery
                    .Where(p => p.FullName.Contains(query.Search));
            }

            // 4️⃣ Filter by Gender
            if (!string.IsNullOrWhiteSpace(query.Gender))
            {
                patientsQuery = patientsQuery
                    .Where(p => p.Gender == query.Gender);
            }

            // 5️⃣ Total Count
            var totalCount = await patientsQuery.CountAsync();

            // 6️⃣ Pagination
            var data = await patientsQuery
                .OrderBy(p => p.FullName)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            // 7️⃣ Return Result
            return new PagedResult<DoctorPatientRowDto>
            {
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                Data = data
            };
        }
    }
}