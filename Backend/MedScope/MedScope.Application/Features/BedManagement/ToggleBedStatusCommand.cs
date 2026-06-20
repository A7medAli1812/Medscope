using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;

namespace MedScope.Application.Features.BedManagement
{
    public record ToggleBedStatusCommand(int Id) : IRequest<Unit>;
}