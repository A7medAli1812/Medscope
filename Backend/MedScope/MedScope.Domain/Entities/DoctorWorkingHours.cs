namespace MedScope.Domain.Entities
{
    public class DoctorWorkingHours
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public string Day { get; set; } = null!;

        public TimeSpan From { get; set; }

        public TimeSpan To { get; set; }

        public int AppointmentDuration { get; set; }
    }
}