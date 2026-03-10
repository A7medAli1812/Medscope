namespace MedScope.Application.DTOs.Doctor
{
    public class UpdateDoctorNoteDto
    {
        public DateOnly Date { get; set; }

        public string Diagnosis { get; set; } = string.Empty;

        public string TreatmentPlan { get; set; } = string.Empty;

        public string? FollowUp { get; set; }
    }
}