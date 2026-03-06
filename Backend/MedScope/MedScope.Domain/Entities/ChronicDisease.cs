public class ChronicDisease
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public string DiseaseName { get; set; }
    public DateTime Date { get; set; }
}