using MediatR;

public class DeleteHospitalCommand : IRequest<Unit>
{
    public int Id { get; set; }
}