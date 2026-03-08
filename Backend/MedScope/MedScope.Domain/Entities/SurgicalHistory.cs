public class SurgicalHistory
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; }

    public string Surgery { get; set; }
    public string Notes { get; set; }

    public DateTime Date { get; set; }
}