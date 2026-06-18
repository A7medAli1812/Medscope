namespace MedScope.Application.DTOs.Doctor.WorkingHours
{
    public class WorkingHoursResponseDto
    {
        public int AppointmentDuration { get; set; }
        public List<WorkingDayResponseDto> WorkingDays { get; set; } = new();
    }

    public class WorkingDayResponseDto
    {
        public string Day { get; set; } = null!;
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
    }
}
