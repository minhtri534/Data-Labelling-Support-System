namespace DataLabellingSupportSystem.Api.Configurations;

public sealed class DevSeedOptions
{
    public bool Enabled { get; init; } = true;

    public string AnnotatorEmail { get; init; } = "annotator@demo.local";

    public string AnnotatorPassword { get; init; } = "Password123!";

    public string AnnotatorFullName { get; init; } = "Demo Annotator";

    public string ProjectName { get; init; } = "Demo Project";

    public string DatasetName { get; init; } = "Demo Dataset";
}
