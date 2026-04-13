using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MedScope.Application.DTOs.Chatbot;
using MedScope.Domain.Entities;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace MedScope.Infrastructure.Services
{
    public class ChatbotService
    {
        private readonly ApplicationDbContext _context;

        public ChatbotService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ChatResponseDto> AskAsync(int patientId, ChatRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
                throw new Exception("Message cannot be empty");

            var responseText = "This is a medical assistant response.";

            var chat = new ChatMessage
            {
                PatientId = patientId,
                Message = dto.Message,
                Response = responseText
            };

            _context.ChatMessages.Add(chat);

            await _context.SaveChangesAsync();

            return new ChatResponseDto
            {
                Response = responseText
            };
        }

        public async Task<List<ChatHistoryDto>> GetHistoryAsync(int patientId)
        {
            return await _context.ChatMessages
                .Where(x => x.PatientId == patientId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new ChatHistoryDto
                {
                    Message = x.Message,
                    Response = x.Response,
                    Date = x.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<string> SaveAttachmentAsync(int patientId, IFormFile file)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);

            var folderPath = Path.Combine("wwwroot", "chat-uploads");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var chat = new ChatMessage
            {
                PatientId = patientId,
                AttachmentUrl = "/chat-uploads/" + fileName
            };

            _context.ChatMessages.Add(chat);

            await _context.SaveChangesAsync();

            return chat.AttachmentUrl;
        }
    }
}
