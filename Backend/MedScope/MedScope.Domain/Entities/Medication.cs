public class Medication
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public string Name { get; set; }
    public string Frequency { get; set; }

    public DateTime Date { get; set; }
}