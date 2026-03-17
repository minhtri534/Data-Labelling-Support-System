using DataLabellingSupportSystem.Api.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDlssControllersAndValidation()
    .AddDlssSwagger()
    .AddDlssDatabase(builder.Configuration)
    .AddDlssDomainServices()
    .AddDlssAiAssist(builder.Configuration)
    .AddDlssStorage(builder.Configuration)
    .AddDlssAuth(builder.Configuration);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend"); 
app.UseDlssPipeline();

app.Run();