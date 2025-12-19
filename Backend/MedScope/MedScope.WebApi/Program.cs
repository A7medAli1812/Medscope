using MedScope.Infrastructure;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Controllers + Enums
// =======================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
    );

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =======================
// DbContext
// =======================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =======================
// Identity
// =======================
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// =======================
// JWT Authentication 🔐
// =======================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var settings = builder.Configuration
            .GetSection("AuthSettings")
            .GetSection("AuthSettings")
            .Get<AuthSettings>();

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = settings!.Issuer,
            ValidAudience = settings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(settings.Key))
        };
    });

// =======================
// Infrastructure Layer
// =======================
builder.Services.AddInfrastructureLayer(builder.Configuration);

// =======================
// Build app
// =======================
var app = builder.Build();

// =======================
// Seed Roles
// =======================
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    await MedScope.Infrastructure.Seed.SeedRoles.SeedAsync(roleManager);
    await MedScope.Infrastructure.Seed.SeedUsers.SeedAsync(userManager);
}

// =======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🔐 مهم جدًا: Authentication قبل Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
