using MedScope.Application.DTOs.MedicalHistory;
using MedScope.Application.Interfaces;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Security.Claims;

namespace MedScope.Infrastructure.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public MedicalHistoryService(
        ApplicationDbContext context,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

        // 🔐 Helper Method للتحقق من ملكية الحجز
        private async Task<int> ValidateAppointmentAndGetPatientId(int appointmentId)
        {
            var userId = _httpContextAccessor.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                throw new Exception("Doctor not found");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                throw new Exception("Appointment not found.");

            if (appointment.DoctorId != doctor.Id)
                throw new UnauthorizedAccessException("You are not allowed.");

            return appointment.PatientId;
        }

        public async Task AddChronicDiseaseAsync(int appointmentId, AddChronicDiseaseDto dto)
    {
        var patientId = await ValidateAppointmentAndGetPatientId(appointmentId);

        var entity = new ChronicDisease
        {
            PatientId = patientId,
            DiseaseName = dto.DiseaseName,
            Date = dto.Date.ToDateTime(TimeOnly.MinValue)
        };

        _context.ChronicDiseases.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task AddSurgicalHistoryAsync(int appointmentId, AddSurgicalHistoryDto dto)
    {
        var patientId = await ValidateAppointmentAndGetPatientId(appointmentId);

        var entity = new SurgicalHistory
        {
            PatientId = patientId,
            Surgery = dto.Surgery,
            Notes = dto.Notes,
            Date = dto.Date.ToDateTime(TimeOnly.MinValue)
        };

        _context.SurgicalHistories.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task AddMedicationAsync(int appointmentId, AddMedicationDto dto)
    {
        var patientId = await ValidateAppointmentAndGetPatientId(appointmentId);

        var entity = new Medication
        {
            PatientId = patientId,
            Name = dto.Name,
            Frequency = dto.Frequency,
            Date = dto.Date.ToDateTime(TimeOnly.MinValue)
        };

        _context.Medications.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task AddAllergyAsync(int appointmentId, AddAllergyDto dto)
    {
        var patientId = await ValidateAppointmentAndGetPatientId(appointmentId);

        var entity = new Allergy
        {
            PatientId = patientId,
            AllergyName = dto.AllergyName,
            Reaction = dto.Reaction,
            Date = dto.Date.ToDateTime(TimeOnly.MinValue)
        };

        _context.Allergies.Add(entity);
        await _context.SaveChangesAsync();
    }
}
}