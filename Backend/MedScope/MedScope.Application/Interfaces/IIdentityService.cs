public interface IIdentityService
{
    Task<ApplicationUserDto?> GetUserByIdAsync(string userId);
}