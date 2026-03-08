using MedScope.Application.Common;
using MedScope.Application.DTOs.Doctor;
using MedScope.Application.DTOs.Doctor.PatientRecord;

namespace MedScope.Application.Interfaces.Doctor;

public interface IDoctorPatientRecordService
{
    Task<PatientRecordDto> GetPatientRecord(int patientId, string doctorUserId);

   
}