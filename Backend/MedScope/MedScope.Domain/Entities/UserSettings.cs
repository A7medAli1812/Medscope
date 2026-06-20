namespace MedScope.Domain.Entities
{
    public class UserSettings
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        public bool SystemAlerts { get; set; }
        public bool SecurityAlerts { get; set; }
        public bool AppointmentReminders { get; set; }
    }
}