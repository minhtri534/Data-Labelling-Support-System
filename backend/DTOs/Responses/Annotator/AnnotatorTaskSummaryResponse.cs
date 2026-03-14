namespace DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;

public sealed record AnnotatorTaskSummaryResponse(
    string Id,
    string Name,
    string ProjectId,
    string? DatasetId,
    int Status,
    int TotalItems,
    int SubmittedItems,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? DueAt
);
