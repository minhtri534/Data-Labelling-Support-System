using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLabellingSupportSystem.Api.Models;

public class TaskHistory
{
    [Key]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty; // history_id

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(TaskId))]
    public string TaskId { get; set; } = string.Empty;

    public string? OldStatus { get; set; }

    public string? NewStatus { get; set; }

    [MaxLength(24)]
    [ForeignKey(nameof(ChangedByUserId))]
    public string ChangedByUserId { get; set; } = string.Empty;

    public DateTime ChangedAt { get; set; }
}
