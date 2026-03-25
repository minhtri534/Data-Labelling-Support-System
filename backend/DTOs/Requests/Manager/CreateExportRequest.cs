namespace DataLabellingSupportSystem.Api.DTOs.Requests.Manager;

public sealed record CreateExportRequest(
    string ProjectId,
    string Format,
    string ExportPath,
    string LabelFormat,
    List<string>? IncludeFields,
    Dictionary<string, string>? Filters
);
