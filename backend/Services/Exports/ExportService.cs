using System.Globalization;
using System.Text;
using System.Text.Json;
using DataLabellingSupportSystem.Api.Common.Constants;
using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.DTOs.Responses.Exports;
using DataLabellingSupportSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Services.Exports;

public sealed class ExportService(AppDbContext dbContext) : IExportService
{
    public async Task<ServiceResponse<YoloExportResponse>> ExportYoloForTaskAsync(string taskId)
    {
        var id = (taskId ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<YoloExportResponse>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<YoloExportResponse>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        var labels = await dbContext.Labels
            .AsNoTracking()
            .Where(x => x.ProjectId == task.ProjectId)
            .OrderBy(x => x.YoloClassId)
            .Select(x => new { x.Id, x.Name, x.YoloClassId })
            .ToListAsync();

        if (labels.Count == 0)
        {
            return ServiceResponse<YoloExportResponse>.Failure("No labels", ["Project has no labels configured"]);
        }

        var labelIdToClassId = labels.ToDictionary(x => x.Id, x => x.YoloClassId, StringComparer.Ordinal);
        var classes = labels.OrderBy(x => x.YoloClassId).Select(x => x.Name).ToList();

        var taskItems = await dbContext.LabelingTaskItems
            .AsNoTracking()
            .Where(x => x.TaskId == id)
            .Select(x => new
            {
                TaskItemId = x.Id,
                DataItem = x.DataItem == null
                    ? null
                    : new
                    {
                        x.DataItem.Id,
                        x.DataItem.ObjectKey,
                        x.DataItem.OriginalWidth,
                        x.DataItem.OriginalHeight
                    }
            })
            .ToListAsync();

        var taskItemIds = taskItems.Select(x => x.TaskItemId).ToList();

        var annotations = await dbContext.Annotations
            .AsNoTracking()
            .Where(x => taskItemIds.Contains(x.TaskItemId) && !x.IsDraft)
            .Select(x => new { x.TaskItemId, x.DataItemId, x.LabelId, x.GeometryData })
            .ToListAsync();

        var annotationsByTaskItem = annotations
            .GroupBy(x => x.TaskItemId)
            .ToDictionary(x => x.Key, x => x.ToList(), StringComparer.Ordinal);

        var files = new List<YoloLabelFileResponse>();

        foreach (var item in taskItems)
        {
            if (item.DataItem is null)
            {
                continue;
            }

            if (!annotationsByTaskItem.TryGetValue(item.TaskItemId, out var annoList) || annoList.Count == 0)
            {
                continue;
            }

            var w = item.DataItem.OriginalWidth;
            var h = item.DataItem.OriginalHeight;
            if (w <= 0 || h <= 0)
            {
                continue;
            }

            var sb = new StringBuilder();

            foreach (var anno in annoList)
            {
                if (!labelIdToClassId.TryGetValue(anno.LabelId, out var classId))
                {
                    continue;
                }

                if (!TryReadBbox(anno.GeometryData, out var bbox))
                {
                    continue;
                }

                var xCenter = (bbox.X + (bbox.Width / 2.0)) / w;
                var yCenter = (bbox.Y + (bbox.Height / 2.0)) / h;
                var wNorm = bbox.Width / w;
                var hNorm = bbox.Height / h;

                if (!IsValidYoloValue(xCenter) || !IsValidYoloValue(yCenter) || !IsValidYoloValue(wNorm) || !IsValidYoloValue(hNorm))
                {
                    continue;
                }

                sb.Append(classId.ToString(CultureInfo.InvariantCulture));
                sb.Append(' ');
                sb.Append(FormatYoloFloat(xCenter));
                sb.Append(' ');
                sb.Append(FormatYoloFloat(yCenter));
                sb.Append(' ');
                sb.Append(FormatYoloFloat(wNorm));
                sb.Append(' ');
                sb.Append(FormatYoloFloat(hNorm));
                sb.AppendLine();
            }

            var content = sb.ToString().TrimEnd();
            if (string.IsNullOrWhiteSpace(content))
            {
                continue;
            }

            files.Add(new YoloLabelFileResponse($"{item.DataItem.Id}.txt", content));
        }

        return ServiceResponse<YoloExportResponse>.Success(new YoloExportResponse(classes, files), "OK");
    }

    private static bool TryReadBbox(string geometryJson, out (double X, double Y, double Width, double Height) bbox)
    {
        bbox = default;

        if (string.IsNullOrWhiteSpace(geometryJson))
        {
            return false;
        }

        try
        {
            using var doc = JsonDocument.Parse(geometryJson);
            var root = doc.RootElement;

            if (!root.TryGetProperty("type", out var typeProp))
            {
                return false;
            }

            var type = typeProp.GetString() ?? string.Empty;
            if (!string.Equals(type, "bbox", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            if (!root.TryGetProperty("x", out var xProp) ||
                !root.TryGetProperty("y", out var yProp) ||
                !root.TryGetProperty("width", out var wProp) ||
                !root.TryGetProperty("height", out var hProp))
            {
                return false;
            }

            bbox = (xProp.GetDouble(), yProp.GetDouble(), wProp.GetDouble(), hProp.GetDouble());
            return bbox.Width > 0 && bbox.Height > 0;
        }
        catch
        {
            return false;
        }
    }

    private static bool IsValidYoloValue(double value)
        => !double.IsNaN(value) && !double.IsInfinity(value) && value >= 0 && value <= 1;

    private static string FormatYoloFloat(double value)
        => value.ToString("0.######", CultureInfo.InvariantCulture);
}
