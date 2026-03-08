namespace MedScope.Application.DTOs.Doctor.PatientRecord;

public class PatientRecordDto
{
    public int PatientId { get; set; }
    public string FullName { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string BloodGroup { get; set; }

    public int ChronicDiseasesCount { get; set; }
    public int SurgeriesCount { get; set; }
    public int MedicationsCount { get; set; }
    public int AllergiesCount { get; set; }

    public List<ChronicDiseaseItemDto> ChronicDiseases { get; set; }
    public List<SurgeryItemDto> Surgeries { get; set; }
    public List<MedicationItemDto> Medications { get; set; }
    public List<AllergyItemDto> Allergies { get; set; }
}