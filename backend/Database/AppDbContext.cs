<<<<<<< Updated upstream
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Utils;
=======
>>>>>>> Stashed changes
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

<<<<<<< Updated upstream
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<Role> Roles { get; set; } = default!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = default!;
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = default!;

    public DbSet<Project> Projects { get; set; } = default!;
    public DbSet<Dataset> Datasets { get; set; } = default!;
    public DbSet<DataItem> DataItems { get; set; } = default!;
    public DbSet<Label> Labels { get; set; } = default!;
    public DbSet<LabelingTask> LabelingTasks { get; set; } = default!;
    public DbSet<AnnotationSet> AnnotationSets { get; set; } = default!;
    public DbSet<Annotation> Annotations { get; set; } = default!;
    public DbSet<TaskHistory> TaskHistories { get; set; } = default!;
    public DbSet<AiPrediction> AiPredictions { get; set; } = default!;
    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<ReviewError> ReviewErrors { get; set; } = default!;
    public DbSet<ErrorType> ErrorTypes { get; set; } = default!;

    public override int SaveChanges()
    {
        ApplyAuditStamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditStamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditStamps()
    {
        var now = DlssTime.VietnamNow;

        foreach (var entry in ChangeTracker.Entries<User>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<RefreshToken>())
        {
            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.CreatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<PasswordResetToken>())
        {
            if (entry.State == EntityState.Added && entry.Entity.CreatedAt == default)
            {
                entry.Entity.CreatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<Project>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<Dataset>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<DataItem>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<Label>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<LabelingTask>())
        {
            if (entry.State == EntityState.Added && string.IsNullOrWhiteSpace(entry.Entity.Id))
            {
                entry.Entity.Id = Utils.ObjectId.NewObjectId();
            }
        }

        foreach (var entry in ChangeTracker.Entries<Annotation>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<AnnotationSet>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<TaskHistory>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                if (entry.Entity.ChangedAt == default)
                {
                    entry.Entity.ChangedAt = now;
                }
            }
        }

        foreach (var entry in ChangeTracker.Entries<AiPrediction>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                entry.Entity.CreatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<Review>())
        {
            if (entry.State == EntityState.Added)
            {
                if (string.IsNullOrWhiteSpace(entry.Entity.Id))
                {
                    entry.Entity.Id = Utils.ObjectId.NewObjectId();
                }

                if (entry.Entity.ReviewedAt == default)
                {
                    entry.Entity.ReviewedAt = now;
                }
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

=======
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
>>>>>>> Stashed changes
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
