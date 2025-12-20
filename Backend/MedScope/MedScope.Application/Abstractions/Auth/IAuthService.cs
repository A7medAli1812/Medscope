using System.Threading.Tasks;
using MedScope.Application.DTOs.Auth;

namespace MedScope.Application.Abstractions.Auth
{
    public interface IAuthService
    {
        Task<AuthResultDto> LoginAsync(LoginDto dto);
        Task<AuthResultDto> RegisterAsync(RegisterDto dto);
    }
}
