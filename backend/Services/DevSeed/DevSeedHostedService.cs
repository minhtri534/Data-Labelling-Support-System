using DataLabellingSupportSystem.Api.Configurations;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Services.Auth;
using DataLabellingSupportSystem.Api.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DataLabellingSupportSystem.Api.Services.DevSeed;

public sealed class DevSeedHostedService(
    IServiceScopeFactory scopeFactory,
    IHostEnvironment environment,
    IOptions<DevSeedOptions> options,
    ILogger<DevSeedHostedService> logger) : IHostedService
{
    // Cố định ID cho các Role để đảm bảo tính nhất quán
    private const string AdminRoleId = "000000000000000000000001";
    private const string ManagerRoleId = "000000000000000000000002";
    private const string AnnotatorRoleId = "000000000000000000000003";

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (!environment.IsDevelopment()) return;

        var opt = options.Value;
        if (!opt.Enabled) return;

        try
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

            // --- 1. XỬ LÝ DATABASE & MIGRATION ---
            var dbExists = await dbContext.Database.CanConnectAsync(cancellationToken);
            
            if (!dbExists)
            {
                logger.LogInformation("Database does not exist. Creating via EnsureCreated...");
                await dbContext.Database.EnsureCreatedAsync(cancellationToken);
            }
            else 
            {
                // Nếu DB đã tồn tại, dùng Migrate để cập nhật bảng mà không làm mất dữ liệu cũ
                var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync(cancellationToken);
                if (pendingMigrations.Any())
                {
                    logger.LogInformation("Applying {Count} pending migrations...", pendingMigrations.Count());
                    await dbContext.Database.MigrateAsync(cancellationToken);
                }
            }

            var rolesToSeed = new List<Role>
            {
                new() { Id = AdminRoleId, Name = "Admin" },
                new() { Id = ManagerRoleId, Name = "Manager" },
                new() { Id = AnnotatorRoleId, Name = "Annotator" }
            };

            foreach (var role in rolesToSeed)
            {
                if (!await dbContext.Roles.AnyAsync(r => r.Id == role.Id, cancellationToken))
                {
                    dbContext.Roles.Add(role);
                    logger.LogInformation("Seed: Role {RoleName} created.", role.Name);
                }
            }
            await dbContext.SaveChangesAsync(cancellationToken);

            // --- 3. SEED USER (ANNOTATOR) ---
            var normalizedEmail = (opt.AnnotatorEmail ?? string.Empty).Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(normalizedEmail))
            {
                logger.LogWarning("Dev seed skipped: AnnotatorEmail is empty");
                return;
            }

            var annotator = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
            if (annotator is null)
            {
                annotator = new User
                {
                    FullName = (opt.AnnotatorFullName ?? string.Empty).Trim(),
                    Email = normalizedEmail,
                    PasswordHash = passwordHasher.Hash(opt.AnnotatorPassword ?? "Password123!"),
                    RoleId = AnnotatorRoleId, // Gán trực tiếp ID vừa seed ở trên
                    Status = 0
                };

                dbContext.Users.Add(annotator);
                await dbContext.SaveChangesAsync(cancellationToken);
                logger.LogInformation("Seed: Annotator user {Email} created.", normalizedEmail);
            }

            // --- 4. SEED PROJECT & DATASET ---
            var projectName = (opt.ProjectName ?? "Demo Project").Trim();
            var project = await dbContext.Projects
                .FirstOrDefaultAsync(x => x.Name == projectName, cancellationToken);

            if (project is null)
            {
                project = new Project
                {
                    Name = projectName,
                    Guideline = "Demo guideline:\n- Draw tight bounding boxes.\n- Ignore small objects.",
                    Status = 0
                };
                dbContext.Projects.Add(project);
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            var datasetName = (opt.DatasetName ?? "Demo Dataset").Trim();
            var dataset = await dbContext.Datasets
                .FirstOrDefaultAsync(x => x.ProjectId == project.Id && x.Name == datasetName, cancellationToken);

            if (dataset is null)
            {
                dataset = new Dataset { ProjectId = project.Id, Name = datasetName };
                dbContext.Datasets.Add(dataset);
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            // --- 5. SEED LABELS ---
            var labels = new[] { 
                new { Name = "person", Id = 0 }, 
                new { Name = "car", Id = 2 } 
            };
            foreach (var l in labels)
            {
                if (!await dbContext.Labels.AnyAsync(x => x.ProjectId == project.Id && x.Name == l.Name, cancellationToken))
                {
                    dbContext.Labels.Add(new Label { ProjectId = project.Id, Name = l.Name, YoloClassId = l.Id });
                }
            }

            // --- 6. SEED DATA ITEMS & TASKS ---
            var desiredDataItems = new[]
            {
                new { Key = "demo/images/0001.jpg", W = 1920, H = 1080 },
                new { Key = "demo/images/0002.jpg", W = 1280, H = 720 }
            };

            foreach (var item in desiredDataItems)
            {
                var exists = await dbContext.DataItems.AnyAsync(x => x.DatasetId == dataset.Id && x.ObjectKey == item.Key, cancellationToken);
                if (!exists)
                {
                    var newDataItem = new DataItem
                    {
                        DatasetId = dataset.Id,
                        StorageProvider = "Local",
                        ObjectKey = item.Key,
                        OriginalWidth = item.W,
                        OriginalHeight = item.H
                    };
                    dbContext.DataItems.Add(newDataItem);
                    await dbContext.SaveChangesAsync(cancellationToken); // Save để lấy ID cho Task

                    // Tạo Task luôn cho DataItem mới này
                    dbContext.LabelingTasks.Add(new LabelingTask
                    {
                        ProjectId = project.Id,
                        DataItemId = newDataItem.Id,
                        AnnotatorId = annotator.Id,
                        Status = "Assigned",
                        AssignedAt = DlssTime.VietnamNow
                    });
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Dev seed process finished successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dev seed failed due to an unexpected error");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}