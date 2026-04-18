using System.Security.Claims;
using MedScope.Application.DTOs.MedicalHistory;
using MedScope.Application.DTOs.Patient;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

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
            var userId = _httpContextAccessor.HttpContext?.User
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

        // 🩺 Get Patient Medical History
        public async Task<PatientMedicalHistoryDto> GetPatientMedicalHistoryAsync(string userId)
        {
            var patientData = await (from p in _context.Patients
                                     join u in _context.Users
                                     on p.UserId equals u.Id
                                     where p.UserId == userId
                                     select new
                                     {
                                         Patient = p,
                                         User = u
                                     }).FirstOrDefaultAsync();

            if (patientData == null)
                return null!;

            var patientId = patientData.Patient.Id;

            var chronicDiseases = await _context.ChronicDiseases
                .Where(x => x.PatientId == patientId)
                .Select(x => x.DiseaseName)
                .ToListAsync();

            var surgeries = await _context.SurgicalHistories
                .Where(x => x.PatientId == patientId)
                .Select(x => x.Surgery)
                .ToListAsync();

            var medications = await _context.Medications
                .Where(x => x.PatientId == patientId)
                .Select(x => x.Name)
                .ToListAsync();

            var allergies = await _context.Allergies
                .Where(x => x.PatientId == patientId)
                .Select(x => x.AllergyName)
                .ToListAsync();

            // 🧾 Visits / Doctor Notes
            var visits = await _context.DoctorNotes
                .Where(x => x.PatientId == patientId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new PatientVisitDto
                {
                    Date = x.CreatedAt.ToString("yyyy-MM-dd"),
                    Diagnosis = x.Diagnosis,
                    TreatmentPlan = x.TreatmentPlan,
                    FollowUp = x.FollowUp
                })
                .ToListAsync();

            return new PatientMedicalHistoryDto
            {
                FullName = patientData.User.FirstName + " " + patientData.User.LastName,
                Email = patientData.User.Email,
                PhoneNumber = patientData.User.PhoneNumber,
                BloodGroup = patientData.Patient.BloodGroup,

                ChronicDiseasesCount = chronicDiseases.Count,
                SurgeriesCount = surgeries.Count,
                MedicationsCount = medications.Count,
                AllergiesCount = allergies.Count,

                ChronicDiseases = chronicDiseases,
                Surgeries = surgeries,
                Medications = medications,
                Allergies = allergies,

                Visits = visits
            };
        }

        // 📋 Get Patient Notes (Tab Notes)
        public async Task<List<PatientNoteDto>> GetPatientNotesAsync(string userId)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return new List<PatientNoteDto>();

            var notes = await _context.DoctorNotes
                .Where(x => x.PatientId == patient.Id)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new PatientNoteDto
                {
                    Date = x.CreatedAt.ToString("yyyy-MM-dd"),
                    Diagnosis = x.Diagnosis,
                    TreatmentPlan = x.TreatmentPlan,
                    FollowUp = x.FollowUp
                })
                .ToListAsync();

            return notes;
        }
    }
}