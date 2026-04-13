namespace MedScope.Application.Features.SuperAdmin.Admins
{
    public class AdminDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string HospitalName { get; set; }
        public string Status { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}