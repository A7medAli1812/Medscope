using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services.Doctor
{
    public class DoctorPatientDeleteService : IDoctorPatientDeleteService
    {
        private readonly ApplicationDbContext _context;

        public DoctorPatientDeleteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> DeletePatient(int patientId, string doctorUserId)
        {
            // الحصول على doctorId
            var doctorId = await _context.Doctors
                .Where(d => d.UserId == doctorUserId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                throw new Exception("Doctor not found");

            // التأكد أن المريض تابع للدكتور
            var hasAccess = await _context.Appointments
                .AnyAsync(a => a.PatientId == patientId && a.DoctorId == doctorId);

            if (!hasAccess)
                throw new Exception("Unauthorized");

            // الحصول على المريض
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (patient == null)
                throw new Exception("Patient not found");

            // Soft Delete
            patient.IsDeleted = true;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}