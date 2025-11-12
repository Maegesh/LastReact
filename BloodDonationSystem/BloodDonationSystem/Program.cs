using BloodBankSystem.Data;
using BloodDonationSystem.Interfaces;
using BloodDonationSystem.Repositories;
using BloodDonationSystem.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("JWT", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Example: \"Authorization: {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "JWT"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddDbContext<BloodContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IDonorProfile,DonorProfileRepo>();
builder.Services.AddScoped<DonorProfileService>();
builder.Services.AddScoped<IUser, UserRepo>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IToken, TokenService>();
builder.Services.AddScoped<IBloodBank, BloodBankRepo>();
builder.Services.AddScoped<BloodBankService>();
builder.Services.AddScoped<IBloodRequest, BloodRequestRepo>();
builder.Services.AddScoped<BloodRequestService>();
builder.Services.AddScoped<IRecipientProfile, RecipientProfileRepo>();
builder.Services.AddScoped<RecipientProfileService>();
builder.Services.AddScoped<IDonationRecord, DonationRecordRepo>();
builder.Services.AddScoped<DonationRecordService>();
builder.Services.AddScoped<IAppointment, AppointmentRepo>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<IBloodStock, BloodStockRepo>();
builder.Services.AddScoped<BloodStockService>();
builder.Services.AddScoped<INotificationLog, NotificationLogRepo>();
builder.Services.AddScoped<NotificationLogService>();
builder.Services.AddScoped<IDonorRequestLink, DonorRequestLinkRepo>();
builder.Services.AddScoped<DonorRequestLinkService>();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(token) && !token.StartsWith("Bearer "))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowReactApp");

// Comment out HTTPS redirection for development
// app.UseHttpsRedirection();

// Enable static files for image serving
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
