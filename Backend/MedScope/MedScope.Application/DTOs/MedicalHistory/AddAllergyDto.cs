namespace MedScope.Application.DTOs.MedicalHistory
{
    public class AddAllergyDto
    {
        public string AllergyName { get; set; }
        public string Reaction { get; set; }
        public DateOnly Date { get; set; }
    }
}