namespace MedScope.Application.DTOs.MedicalHistory
{
    public class AddMedicationDto
    {
        public string Name { get; set; }
        public string Frequency { get; set; }
        public DateOnly Date { get; set; }
    }
}