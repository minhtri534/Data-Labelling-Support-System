using System.ComponentModel.DataAnnotations;

namespace DataLabellingSupportSystem.Api.Models;

public class DataItem
{
    [Required]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    public string DatasetId { get; set; } = string.Empty;

    public Dataset? Dataset { get; set; }

    [Required]
    [MaxLength(20)]
    public string StorageProvider { get; set; } = "Local";

    [Required]
    [MaxLength(500)]
    public string ObjectKey { get; set; } = string.Empty;

    public int OriginalWidth { get; set; }

    public int OriginalHeight { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
