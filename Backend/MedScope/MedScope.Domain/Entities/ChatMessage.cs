using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Domain.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public string Message { get; set; }

        public string Response { get; set; }

        public string? AttachmentUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
