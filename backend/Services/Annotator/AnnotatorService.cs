using DataLabellingSupportSystem.Api.Database;

namespace DataLabellingSupportSystem.Api.Services.Annotator;

public sealed partial class AnnotatorService(AppDbContext dbContext) : IAnnotatorService
{
    private readonly AppDbContext _dbContext = dbContext;
}
