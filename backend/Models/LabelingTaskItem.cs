using System.ComponentModel.DataAnnotations;

namespace DataLabellingSupportSystem.Api.Models;

public class LabelingTaskItem
{
    [Required]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    public string TaskId { get; set; } = string.Empty;

    public LabelingTask? Task { get; set; }

    [Required]
    [MaxLength(24)]
    public string DataItemId { get; set; } = string.Empty;

    public DataItem? DataItem { get; set; }

    public LabelingTaskItemStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? LastSavedAt { get; set; }

    public int OrderIndex { get; set; }
}
