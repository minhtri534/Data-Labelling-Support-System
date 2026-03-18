using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLabellingSupportSystem.Api.Models;

public class AnnotationSet
{
    [Key]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(TaskId))]
    public string TaskId { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(CreatedByUserId))]
    public string CreatedByUserId { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
