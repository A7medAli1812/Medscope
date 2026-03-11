using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Chatbot
{
    public class ChatAttachmentDto
    {
        public byte[] File { get; set; }

        public string FileName { get; set; }
    }
}
