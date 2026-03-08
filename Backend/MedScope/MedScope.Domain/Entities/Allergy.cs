public class Allergy
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public string AllergyName { get; set; }
    public string Reaction { get; set; }

    public DateTime Date { get; set; }
}