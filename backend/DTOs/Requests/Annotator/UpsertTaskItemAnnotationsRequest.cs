using System.Text.Json;

namespace DataLabellingSupportSystem.Api.DTOs.Requests.Annotator;

public sealed record UpsertTaskItemAnnotationsRequest(List<UpsertAnnotationObject> Objects);

public sealed record UpsertAnnotationObject(
    string LabelId,
    JsonElement GeometryData
);
