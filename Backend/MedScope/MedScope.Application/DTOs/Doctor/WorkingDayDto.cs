namespace MedScope.Application.DTOs.Doctor.WorkingHours
{
    public class WorkingDayDto
    {
        public string Day { get; set; } = null!; // Sunday, Monday...
        public string From { get; set; }
        public string To { get; set; }
    }
}