public interface IPatientService
{
    Task<object> GetPatientsAsync(PatientQueryParams query);
    Task<bool> UpdatePatientAsync(int patientId, UpdatePatientDto dto);
    Task<bool> DeletePatientAsync(int patientId);
    Task<PatientDetailsDto?> GetPatientByIdAsync(int id);
}