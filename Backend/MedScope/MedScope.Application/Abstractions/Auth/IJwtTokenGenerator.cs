using System.Threading.Tasks;

namespace MedScope.Application.Abstractions.Auth
{
    public interface IJwtTokenGenerator
    {
        Task<string> GenerateTokenAsync(string userId, string email, IList<string> roles);
    }

}