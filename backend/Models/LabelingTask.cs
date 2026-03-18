using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLabellingSupportSystem.Api.Models;

public class LabelingTask
{
    [Required]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    public string ProjectId { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(DataItemId))]
    public string DataItemId { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(AnnotatorId))]
    public string AnnotatorId { get; set; } = string.Empty;

    [MaxLength(24)]
    [ForeignKey(nameof(AssignedByUserId))]
    public string? AssignedByUserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Assigned";

    public DateTime? AssignedAt { get; set; }

    public DateTime? CompletedAt { get; set; }
}
