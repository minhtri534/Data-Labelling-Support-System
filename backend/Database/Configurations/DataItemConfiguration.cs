using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Database.ValueGenerators;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataLabellingSupportSystem.Api.Database.Configurations;

public sealed class DataItemConfiguration : IEntityTypeConfiguration<DataItem>
{
    public void Configure(EntityTypeBuilder<DataItem> builder)
    {
        builder.ToTable("DataItems");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("_id")
            .HasColumnType("varchar(24)")
            .HasSentinel(string.Empty)
            .ValueGeneratedOnAdd()
            .HasValueGenerator<ObjectIdValueGenerator>();

        builder.Property(x => x.DatasetId)
            .HasColumnName("datasetId")
            .HasColumnType("varchar(24)")
            .HasMaxLength(24)
            .IsRequired();

        builder.HasOne(x => x.Dataset)
            .WithMany()
            .HasForeignKey(x => x.DatasetId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(x => x.StorageProvider)
            .HasColumnName("storageProvider")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.ObjectKey)
            .HasColumnName("objectKey")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.OriginalWidth)
            .HasColumnName("originalWidth")
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property(x => x.OriginalHeight)
            .HasColumnName("originalHeight")
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("createdAt")
            .HasDefaultValueSql("DATEADD(HOUR, 7, SYSUTCDATETIME())")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updatedAt")
            .HasDefaultValueSql("DATEADD(HOUR, 7, SYSUTCDATETIME())")
            .IsRequired();
    }
}
