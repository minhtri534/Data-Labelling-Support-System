namespace DataLabellingSupportSystem.Api.Services.Storage;

public interface IStorageService
{
    Task<(Stream Stream, string ContentType, string FileName)?> OpenReadAsync(string storageProvider, string objectKey, CancellationToken cancellationToken);
}
