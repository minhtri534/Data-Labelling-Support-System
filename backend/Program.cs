using DataLabellingSupportSystem.Api.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDlssControllersAndValidation()
    .AddDlssSwagger()
    .AddDlssDatabase(builder.Configuration)
    .AddDlssDomainServices()
    .AddDlssAuth(builder.Configuration)
    .AddDlssCors();

var app = builder.Build();

app.UseDlssPipeline();

app.Run();
