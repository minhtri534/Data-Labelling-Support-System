namespace DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;

public sealed record AnnotatorTaskItemResponse(
    string Id,
    string DataItemId,
    string StorageProvider,
    string ObjectKey,
    int OriginalWidth,
    int OriginalHeight,
    int Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? LastSavedAt,
    int OrderIndex
);
