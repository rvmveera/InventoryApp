using InventoryAPI.Data;
using InventoryAPI.IRepository;
using InventoryAPI.Models;
using InventoryAPI.Repository;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // React dev server
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

//Configure EF Core with SQL Server
/*builder.Services.AddDbContext<InventoryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
*/

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
     .EnableSensitiveDataLogging()
        .LogTo(Console.WriteLine, LogLevel.Information);
});



// ✅ Register Aadhaar encryption service
builder.Services.AddScoped<IAadhaarCrypto, AadhaarCrypto>();

// ✅ Register password hasher
builder.Services.AddSingleton<PasswordHasher<User>>();


// Repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

// JWT Service
builder.Services.AddSingleton<JwtService>();

// Register DbContext with DI
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// ✅ Add controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger UI - for dev and prod

app.UseSwagger();
app.UseSwaggerUI();


// Enable CORS before controllers
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();