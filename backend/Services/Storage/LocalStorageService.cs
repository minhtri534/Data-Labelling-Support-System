using DataLabellingSupportSystem.Api.Configurations;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;

namespace DataLabellingSupportSystem.Api.Services.Storage;

public sealed class LocalStorageService(IHostEnvironment env, IOptions<StorageOptions> options) : IStorageService
{
    private readonly StorageOptions _options = options.Value;
    private readonly FileExtensionContentTypeProvider _contentTypeProvider = new();

    public Task<(Stream Stream, string ContentType, string FileName)?> OpenReadAsync(
        string storageProvider,
        string objectKey,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(storageProvider, "Local", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult<(Stream, string, string)?>(null);
        }

        var key = (objectKey ?? string.Empty).Trim().Replace('\\', '/');
        if (string.IsNullOrWhiteSpace(key))
        {
            return Task.FromResult<(Stream, string, string)?>(null);
        }

        var root = _options.LocalRootPath;
        if (string.IsNullOrWhiteSpace(root))
        {
            root = "storage";
        }

        var rootPath = Path.IsPathRooted(root)
            ? root
            : Path.Combine(env.ContentRootPath, root);

        var fullPath = Path.GetFullPath(Path.Combine(rootPath, key));
        var normalizedRoot = Path.GetFullPath(rootPath);

        // Prevent path traversal by ensuring fullPath stays under rootPath
        if (!fullPath.StartsWith(normalizedRoot, StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult<(Stream, string, string)?>(null);
        }

        if (!File.Exists(fullPath))
        {
            return Task.FromResult<(Stream, string, string)?>(null);
        }

        var fileName = Path.GetFileName(fullPath);
        var contentType = _contentTypeProvider.TryGetContentType(fullPath, out var ct)
            ? ct
            : "application/octet-stream";

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult<(Stream, string, string)?>(new(stream, contentType, fileName));
    }
}
