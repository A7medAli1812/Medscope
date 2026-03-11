using MedScope.Application.DTOs.Patient;

public interface IPatientService
{
    Task<object> GetPatientsAsync(PatientQueryParams query);

    Task<bool> UpdatePatientAsync(int patientId, UpdatePatientDto dto);

    Task<bool> DeletePatientAsync(int patientId);

    Task<PatientDetailsDto?> GetPatientByIdAsync(int id);

    Task<PatientProfileDto> GetProfileAsync(string userId);

    Task<bool> UpdateProfileAsync(string userId, UpdatePatientProfileDto dto);
    Task<bool> UpdateNotificationSettingsAsync(string userId, UpdateNotificationSettingsDto dto);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    Task<bool> DeleteAccountAsync(string userId);
}