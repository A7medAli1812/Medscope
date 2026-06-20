using System.ComponentModel.DataAnnotations;

public class UpdatePatientDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }

    [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid blood group (e.g., A+, O-)")]
    public string? BloodGroup { get; set; }
}
