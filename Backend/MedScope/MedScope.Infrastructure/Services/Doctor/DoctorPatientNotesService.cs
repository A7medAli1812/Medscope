using MedScope.Application.DTOs.Doctor.Notes;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services.Doctor
{
    public class DoctorPatientNotesService : IDoctorPatientNotesService
    {
        private readonly ApplicationDbContext _context;

        public DoctorPatientNotesService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddPatientNote(int patientId, string doctorUserId, AddPatientNoteDto dto)
        {
            var doctorId = await _context.Doctors
                .Where(d => d.UserId == doctorUserId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                throw new Exception("Doctor not found");

            var hasAccess = await _context.Appointments
                .AnyAsync(a => a.PatientId == patientId && a.DoctorId == doctorId);

            if (!hasAccess)
                throw new Exception("Unauthorized access");

            var note = new DoctorNote
            {
                PatientId = patientId,
                DoctorId = doctorId,
                Date = dto.Date.ToDateTime(TimeOnly.MinValue),
                Diagnosis = dto.Diagnosis,
                TreatmentPlan = dto.TreatmentPlan,
                FollowUp = dto.FollowUp
            };

            _context.DoctorNotes.Add(note);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}