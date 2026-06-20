using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace MedScope.IntegrationTests.Controllers
{
    public class AuthIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public AuthIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_ForInvalidCredentials()
        {
            // Arrange
            var loginDto = new
            {
                Email = "invalid@test.com",
                Password = "wrongpassword"
            };
            var content = new StringContent(JsonSerializer.Serialize(loginDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/login", content);

            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
            var contentString = await response.Content.ReadAsStringAsync();
            contentString.Should().Contain("message");
        }

        [Fact]
        public async Task VerifyOtp_ShouldReturnBadRequest_ForInvalidOtp()
        {
            // Arrange
            var req = new
            {
                Email = "test@test.com",
                Otp = "000000"
            };
            var content = new StringContent(JsonSerializer.Serialize(req), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/verify-otp", content);

            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
        }
    }
}
