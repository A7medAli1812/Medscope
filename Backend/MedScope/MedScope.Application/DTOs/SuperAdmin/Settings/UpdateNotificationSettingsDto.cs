namespace MedScope.Application.DTOs.SuperAdmin.Settings
{
    public class UpdateNotificationSettingsDto
    {
        public bool SystemAlerts { get; set; }
        public bool SecurityAlerts { get; set; }
        public bool AppointmentReminders { get; set; }
    }
}