using MedScope.Application.DTOs.Hospital;
using Microsoft.AspNetCore.Http;

namespace MedScope.Application.Interfaces
{
    /// <summary>
    /// Application-layer contract for hospital-related queries.
    /// </summary>
    public interface IHospitalService
    {
        /// <summary>
        /// Returns the lightweight hospital cards needed by the public Home Page.
        /// Only active, non-deleted hospitals are returned.
        /// </summary>
        Task<List<HomeHospitalDto>> GetHomeHospitalsAsync();
        
        Task<string> UploadHospitalImageAsync(int hospitalId, IFormFile file);
    }
}
