using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataLabellingSupportSystem.Api.Models;

public class Review
{
    [Key]
    [MaxLength(24)]
    public string Id { get; set; } = string.Empty; // review_id

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(AnnotationSetId))]
    public string AnnotationSetId { get; set; } = string.Empty;

    [Required]
    [MaxLength(24)]
    [ForeignKey(nameof(ReviewerId))]
    public string ReviewerId { get; set; } = string.Empty;

    [Required]
    public string Result { get; set; } = string.Empty;

    public int Score { get; set; }

    public string? Comment { get; set; }

    public DateTime ReviewedAt { get; set; }
}
