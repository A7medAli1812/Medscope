namespace MedScope.Application.DTOs.Doctor.WorkingHours
{
    public class WorkingDayDto
    {
        public string Day { get; set; } = null!; // Sunday, Monday...
        public TimeOnly From { get; set; }
        public TimeOnly To { get; set; }
    }
}