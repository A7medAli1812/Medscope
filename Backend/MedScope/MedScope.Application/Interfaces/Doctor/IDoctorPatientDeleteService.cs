namespace MedScope.Application.Interfaces.Doctor
{
    public interface IDoctorPatientDeleteService
    {
        Task<bool> DeletePatient(int patientId, string doctorUserId);
    }
}