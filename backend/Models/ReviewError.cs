using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Models;

[PrimaryKey(nameof(ReviewId), nameof(ErrorTypeId))]
public class ReviewError
{
    [MaxLength(24)]
    public string ReviewId { get; set; } = string.Empty;

    [ForeignKey(nameof(ReviewId))]
    public Review? Review { get; set; }

    [MaxLength(24)]
    public string ErrorTypeId { get; set; } = string.Empty;

    [ForeignKey(nameof(ErrorTypeId))]
    public ErrorType? ErrorType { get; set; }
}
