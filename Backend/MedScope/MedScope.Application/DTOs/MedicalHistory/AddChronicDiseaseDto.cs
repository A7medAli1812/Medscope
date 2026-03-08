namespace MedScope.Application.DTOs.MedicalHistory
{
    public class AddChronicDiseaseDto
    {
        public string DiseaseName { get; set; }
        public DateOnly Date { get; set; }
    }
}