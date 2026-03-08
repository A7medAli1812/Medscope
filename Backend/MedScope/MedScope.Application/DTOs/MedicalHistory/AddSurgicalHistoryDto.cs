namespace MedScope.Application.DTOs.MedicalHistory
{
    public class AddSurgicalHistoryDto
    {
        public string Surgery { get; set; }
        public string Notes { get; set; }
        public DateOnly Date { get; set; }
    }
}