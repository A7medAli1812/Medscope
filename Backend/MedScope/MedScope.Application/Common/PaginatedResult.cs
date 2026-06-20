using System;
namespace MedScope.Application.Common
{
    public class PaginatedResult<T>
    {
        public List<T> Data { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }

        // 🔥 ده المهم
        public PaginatedResult(List<T> data, int totalCount, int page, int pageSize)
        {
            Data = data;
            CurrentPage = page;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        }
    }
}