using MedScope.Application.DTOs.Doctor;
using MedScope.Application.DTOs.Doctor.Notes;

namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorPatientNotesService
    {
        Task<bool> AddPatientNote(int patientId, string doctorUserId, AddPatientNoteDto dto);
        Task<List<DoctorNoteDto>> GetPatientNotes(int patientId, string doctorUserId);
    }
}