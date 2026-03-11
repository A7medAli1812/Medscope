using MedScope.Application.DTOs.Doctor.PatientRecord;
using MedScope.Application.DTOs.MedicalHistory;
namespace MedScope.Application.Interfaces
{
    public interface IMedicalHistoryService
    {
        Task AddChronicDiseaseAsync(int appointmentId, AddChronicDiseaseDto dto);

        Task AddSurgicalHistoryAsync(int appointmentId, AddSurgicalHistoryDto dto);

        Task AddMedicationAsync(int appointmentId, AddMedicationDto dto);

        Task AddAllergyAsync(int appointmentId, AddAllergyDto dto);
        Task<PatientMedicalHistoryDto> GetPatientMedicalHistoryAsync(string userId);
    }
}