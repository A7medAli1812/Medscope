
﻿using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using MedScope.Application;
using MedScope.Application.Abstractions.Admin;
using MedScope.Application.Common;
using MedScope.Application.Features.Admin;
using MedScope.Application.Features.Auth;
using MedScope.Application.Interfaces;
using MedScope.Domain.Entities;
using MedScope.Infrastructure;
using MedScope.Infrastructure.Identity;
using MedScope.Infrastructure.Persistence;
using MedScope.Infrastructure.Seed;
using MedScope.Infrastructure.Services;
using MedScope.WebApi.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;




var builder = WebApplication.CreateBuilder(args);

// =======================
// 🔥 لمنع تأثير ملف appsettings.Production.json الذي يتولد على السيرفر
// نقوم بإعادة تحميل appsettings.json ليكون له الأولوية القصوى
// =======================
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

// =======================
// DbContext
// =======================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// =======================
// Identity (مرة واحدة بس)
// =======================
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// =======================
// Bind AuthSettings
// =======================
builder.Services.Configure<AuthSettings>(
    builder.Configuration.GetSection("AuthSettings"));

// =======================
// JWT Authentication
// =======================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;

    var settings = builder.Configuration
        .GetSection("AuthSettings")
        .Get<AuthSettings>();

    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = settings!.Issuer,
            ValidAudience = settings.Audience,
            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(settings.Key)
                ),

            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier,

            // 🔥 الحل المهم
            ClockSkew = TimeSpan.Zero
        };
});

// =======================
// Application + Infrastructure
// =======================
builder.Services.AddApplicationLayer();
builder.Services.AddInfrastructureLayer(builder.Configuration);

// =======================
// Services
// =======================
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddScoped<ChatbotService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ForgotPasswordHandler>();
builder.Services.AddScoped<ResetPasswordHandler>();
builder.Services.AddScoped<VerifyOtpHandler>();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5174",
                "http://localhost:5173",
                "http://localhost:5173/",
                "http://localhost:5173/",
                "https://medscope-v3.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =======================
// Controllers
// =======================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());

        // 👇 ده الجديد
        options.JsonSerializerOptions.Converters
            .Add(new DateOnlyJsonConverter());

        // options.JsonSerializerOptions.DefaultIgnoreCondition =
        //     JsonIgnoreCondition.WhenWritingNull;
    });

// =======================
// Swagger (مرة واحدة بس)
// =======================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MedScope API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    c.CustomSchemaIds(type => type.FullName);

    // 👇👇👇 ده المهم
    c.OperationFilter<FileUploadOperationFilter>();
});

// =======================
// PDF License
// =======================
QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

// =======================
// Build App
// =======================
var app = builder.Build();

// =======================
// Middleware
// =======================
app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// =======================
// Custom Status Codes
// =======================
app.UseStatusCodePages(async context =>
{
    var response = context.HttpContext.Response;

    if (response.StatusCode == 403)
    {
        response.ContentType = "application/json";
        await response.WriteAsync(
            "{\"message\": \"Unauthorized - Admin access only\"}");
    }

    if (response.StatusCode == 401)
    {
        response.ContentType = "application/json";
        await response.WriteAsync(
            "{\"message\": \"Unauthorized - Please login\"}");
    }
});

app.MapControllers();

// =======================
// Seed Data
// =======================
using (var scope = app.Services.CreateScope())
{
    try
    {
        var services = scope.ServiceProvider;

        var roleManager =
            services.GetRequiredService<RoleManager<IdentityRole>>();

        var userManager =
            services.GetRequiredService<UserManager<ApplicationUser>>();

        var db =
            services.GetRequiredService<ApplicationDbContext>();

        await SeedRoles.SeedAsync(roleManager);
        await SeedUsers.SeedAsync(userManager);
        await BloodBankSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Seed Error: " + ex.Message);
    }
}

app.Run();

public partial class Program { }