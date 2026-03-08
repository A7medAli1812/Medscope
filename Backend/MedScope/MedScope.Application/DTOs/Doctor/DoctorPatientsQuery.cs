namespace MedScope.Application.DTOs.Doctor;
public class DoctorPatientsQuery
{
    public string? Search { get; set; }      // search by name
    public string? Gender { get; set; }      // Male / Female
    public int PageNumber { get; set; } = 1; // default page
    public int PageSize { get; set; } = 10;  // rows per page
}