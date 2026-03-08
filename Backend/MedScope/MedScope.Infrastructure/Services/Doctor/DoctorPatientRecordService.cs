using MedScope.Application.DTOs.Doctor.PatientRecord;
using MedScope.Application.Interfaces.Doctor;
using MedScope.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class DoctorPatientRecordService : IDoctorPatientRecordService
{
    private readonly ApplicationDbContext _context;

    public DoctorPatientRecordService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PatientRecordDto> GetPatientRecord(int patientId, string doctorUserId)
    {
        var doctorId = await _context.Doctors
            .Where(d => d.UserId == doctorUserId)
            .Select(d => d.Id)
            .FirstOrDefaultAsync();

        var hasAccess = await _context.Appointments
            .AnyAsync(a => a.PatientId == patientId && a.DoctorId == doctorId);

        if (!hasAccess)
            throw new Exception("Unauthorized access");

        var patient = await (
            from p in _context.Patients
            join u in _context.Users on p.UserId equals u.Id
            where p.Id == patientId
            select new
            {
                p.Id,
                p.BloodGroup,
                u.FirstName,
                u.LastName,
                u.Gender,
                u.PhoneNumber,
                u.Email,
                u.DateOfBirth
            }).FirstOrDefaultAsync();

      var chronic = await _context.ChronicDiseases
    .Where(x => x.PatientId == patientId)
    .Select(x => new ChronicDiseaseItemDto
    {
        Name = x.DiseaseName,
        DiagnosedDate = DateOnly.FromDateTime(x.Date)
    })
    .ToListAsync();

var surgeries = await _context.SurgicalHistories
    .Where(x => x.PatientId == patientId)
    .Select(x => new SurgeryItemDto
    {
        Name = x.Surgery,
        Notes = x.Notes,
        Date = DateOnly.FromDateTime(x.Date)
    })
    .ToListAsync();

var meds = await _context.Medications
    .Where(x => x.PatientId == patientId)
    .Select(x => new MedicationItemDto
    {
        Name = x.Name,
        Frequency = x.Frequency,
        StartedDate = DateOnly.FromDateTime(x.Date)
    })
    .ToListAsync();

var allergies = await _context.Allergies
    .Where(x => x.PatientId == patientId)
    .Select(x => new AllergyItemDto
    {
        Name = x.AllergyName,
        Reaction = x.Reaction
    })
    .ToListAsync();

        return new PatientRecordDto
        {
            PatientId = patient.Id,
            FullName = patient.FirstName + " " + patient.LastName,
            Age = DateTime.Now.Year - patient.DateOfBirth.Year,
            Gender = patient.Gender.ToString(),
            PhoneNumber = patient.PhoneNumber,
            Email = patient.Email,
            BloodGroup = patient.BloodGroup,

            ChronicDiseasesCount = chronic.Count,
            SurgeriesCount = surgeries.Count,
            MedicationsCount = meds.Count,
            AllergiesCount = allergies.Count,

            ChronicDiseases = chronic,
            Surgeries = surgeries,
            Medications = meds,
            Allergies = allergies
        };
    }
}