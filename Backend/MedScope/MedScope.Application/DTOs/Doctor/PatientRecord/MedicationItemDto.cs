namespace MedScope.Application.DTOs.Doctor.PatientRecord;

public class MedicationItemDto
{
    public string Name { get; set; }
    public string Frequency { get; set; }
    public DateOnly StartedDate { get; set; }
}