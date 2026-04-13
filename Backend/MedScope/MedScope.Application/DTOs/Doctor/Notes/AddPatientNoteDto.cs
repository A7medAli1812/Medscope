namespace MedScope.Application.DTOs.Doctor.Notes
{
    public class AddPatientNoteDto
    {
        public DateOnly Date { get; set; }

        public string Diagnosis { get; set; }

        public string TreatmentPlan { get; set; }

        public string? FollowUp { get; set; }
    }
}