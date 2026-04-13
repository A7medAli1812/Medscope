using MediatR;

public class ChangeHospitalStatusCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public bool IsActive { get; set; }
}