using MedScope.Application.DTOs.Doctor;

namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorPatientNoteUpdateService
    {
        Task UpdateNote(int noteId, string doctorUserId, UpdateDoctorNoteDto dto);
    }
}