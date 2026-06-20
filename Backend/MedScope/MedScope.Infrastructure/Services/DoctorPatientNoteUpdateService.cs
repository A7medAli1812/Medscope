using MedScope.Application.DTOs.Doctor;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services.Doctor
{
    public class DoctorPatientNoteUpdateService : IDoctorPatientNoteUpdateService
    {
        private readonly ApplicationDbContext _context;

        public DoctorPatientNoteUpdateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task UpdateNote(int noteId, string doctorUserId, UpdateDoctorNoteDto dto)
        {
            var doctorId = await _context.Doctors
                .Where(d => d.UserId == doctorUserId)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            if (doctorId == 0)
                throw new Exception("Doctor not found");

            var note = await _context.DoctorNotes
      .FirstOrDefaultAsync(n => n.Id == noteId && n.DoctorId == doctorId);

            if (note == null)
                throw new Exception("Note not found");

            note.Date = dto.Date.ToDateTime(TimeOnly.MinValue);
            note.Diagnosis = dto.Diagnosis;
            note.TreatmentPlan = dto.TreatmentPlan;
            note.FollowUp = dto.FollowUp;

            await _context.SaveChangesAsync();
        }
    }
}