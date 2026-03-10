namespace MedScope.Application.DTOs.Doctor
{
    public class DoctorNoteDto
    {
        public int Id { get; set; }

        public DateOnly Date { get; set; }

        public string Diagnosis { get; set; } = string.Empty;

        public string TreatmentPlan { get; set; } = string.Empty;

        public string? FollowUp { get; set; }
    }
}