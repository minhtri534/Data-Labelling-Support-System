using System.ComponentModel.DataAnnotations;

namespace DataLabellingSupportSystem.Api.Models;

public class Annotation
{
    [Required]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    public string TaskItemId { get; set; } = string.Empty;

    public LabelingTaskItem? TaskItem { get; set; }

    [Required]
    [MaxLength(24)]
    public string DataItemId { get; set; } = string.Empty;

    public DataItem? DataItem { get; set; }

    [Required]
    [MaxLength(24)]
    public string LabelId { get; set; } = string.Empty;

    public Label? Label { get; set; }

    [Required]
    public string GeometryData { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    public string CreatedByUserId { get; set; } = string.Empty;

    public User? CreatedByUser { get; set; }

    public bool IsDraft { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }
}
