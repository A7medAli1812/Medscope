using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedScope.Application.DTOs.Chatbot
{
    public class ChatHistoryDto
    {
        public string Message { get; set; }

        public string Response { get; set; }

        public DateTime Date { get; set; }
    }
}
