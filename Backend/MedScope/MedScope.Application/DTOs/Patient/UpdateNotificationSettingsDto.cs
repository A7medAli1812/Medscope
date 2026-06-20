using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Patient
{
    public class UpdateNotificationSettingsDto
    {
        public bool EmailNotifications { get; set; }

        public bool AppointmentReminders { get; set; }
    }
}
