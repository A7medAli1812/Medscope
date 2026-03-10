using MedScope.Application.DTOs.Doctor.Notes;

namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorPatientNotesService
    {
        Task<bool> AddPatientNote(int patientId, string doctorUserId, AddPatientNoteDto dto);
    }
}