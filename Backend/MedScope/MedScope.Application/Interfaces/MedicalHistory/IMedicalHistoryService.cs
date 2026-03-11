using MedScope.Application.DTOs.Doctor.PatientRecord;
using MedScope.Application.DTOs.MedicalHistory;
using MedScope.Application.DTOs.Patient;

namespace MedScope.Application.Interfaces
{
    public interface IMedicalHistoryService
    {
        // Doctor adds data
        Task AddChronicDiseaseAsync(int appointmentId, AddChronicDiseaseDto dto);

        Task AddSurgicalHistoryAsync(int appointmentId, AddSurgicalHistoryDto dto);

        Task AddMedicationAsync(int appointmentId, AddMedicationDto dto);

        Task AddAllergyAsync(int appointmentId, AddAllergyDto dto);

        // Patient Medical History tab
        Task<PatientMedicalHistoryDto> GetPatientMedicalHistoryAsync(string userId);

        // Patient Notes tab
        Task<List<PatientNoteDto>> GetPatientNotesAsync(string userId);
    }
}