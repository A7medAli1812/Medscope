using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;

namespace MedScope.Application.Features.BedManagement
{
    public class CreateBedCommand : IRequest<int>
    {
        public string BedNumber { get; set; } = null!;
        public string Ward { get; set; } = null!;
    }
}