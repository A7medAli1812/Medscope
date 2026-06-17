using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.IntegrationTests.Controllers
{
    public class ReportsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ReportsIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task ExportDashboardPdf_ShouldReturnUnauthorized_WhenNoToken()
        {
            // Act
            var response = await _client.GetAsync("/api/super-admin/reports/dashboard/pdf?month=1");

            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task ExportAdminsPdf_ShouldReturnUnauthorized_WhenNoToken()
        {
            // Act
            var response = await _client.GetAsync("/api/super-admin/reports/admins/pdf");

            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
