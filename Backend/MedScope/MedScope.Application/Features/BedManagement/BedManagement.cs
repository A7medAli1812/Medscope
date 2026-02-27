using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using MedScope.Application.DTOs.BedManagementDto;
using System.Collections.Generic;

namespace MedScope.Application.Features.BedManagement
{


    public class GetBedManagementQuery : IRequest<List<BedManagementDto>>
    {
    }
}
