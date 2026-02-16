using DataLabellingSupportSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Cấu hình Fluent API ở đây hoặc tách ra các file Configuration riêng trong thư mục Configurations
        // modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
