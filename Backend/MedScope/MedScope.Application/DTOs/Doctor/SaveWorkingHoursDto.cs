namespace MedScope.Application.DTOs.Doctor.WorkingHours
{
    public class SaveWorkingHoursDto
    {
        public int AppointmentDuration { get; set; } // 15 / 30 / 45 / 60

        public List<WorkingDayDto> WorkingDays { get; set; } = new();
    }
}