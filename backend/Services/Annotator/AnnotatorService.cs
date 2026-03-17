using System.Text.Json;
using DataLabellingSupportSystem.Api.Common.Constants;
using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.DTOs.Requests.Annotator;
using DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Utils;
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Services.Annotator;

public sealed class AnnotatorService(AppDbContext dbContext) : IAnnotatorService
{
    public async Task<ServiceResponse<List<AnnotatorTaskSummaryResponse>>> GetMyTasksAsync(string userId)
    {
        var uid = (userId ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<List<AnnotatorTaskSummaryResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        var tasks = await dbContext.LabelingTasks
            .AsNoTracking()
            .Where(x => x.AnnotatorId == uid)
            .OrderByDescending(x => x.AssignedAt)
            .Select(x => new AnnotatorTaskSummaryResponse(
                x.Id,
                x.ProjectId,
                x.DataItemId,
                x.Status,
                x.AssignedAt,
                x.CompletedAt))
            .ToListAsync();

        return ServiceResponse<List<AnnotatorTaskSummaryResponse>>.Success(tasks, "OK");
    }

    public async Task<ServiceResponse<bool>> StartTaskAsync(string userId, string taskId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<bool>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks.FirstOrDefaultAsync(x => x.Id == id);
        if (task is null)
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var now = DlssTime.VietnamNow;

        if (string.Equals(task.Status, "Assigned", StringComparison.OrdinalIgnoreCase))
        {
            var oldStatus = task.Status;
            task.Status = "InProgress";

            dbContext.TaskHistories.Add(new TaskHistory
            {
                TaskId = task.Id,
                OldStatus = oldStatus,
                NewStatus = task.Status,
                ChangedByUserId = uid
            });
        }

        task.AssignedAt ??= now;

        await dbContext.SaveChangesAsync();
        return ServiceResponse<bool>.Success(true, "Started");
    }

    public async Task<ServiceResponse<List<AnnotatorTaskItemResponse>>> GetTaskItemsAsync(string userId, string taskId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure("Invalid task", ["Task id is required"]);
        }

        var item = await dbContext.LabelingTasks
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.AnnotatorId,
                x.DataItemId,
                StorageProvider = x.DataItem != null ? x.DataItem.StorageProvider : null,
                ObjectKey = x.DataItem != null ? x.DataItem.ObjectKey : null,
                OriginalWidth = x.DataItem != null ? x.DataItem.OriginalWidth : 0,
                OriginalHeight = x.DataItem != null ? x.DataItem.OriginalHeight : 0
            })
            .FirstOrDefaultAsync();

        if (item is null)
        {
            return ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(item.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var items = new List<AnnotatorTaskItemResponse>
        {
            new(
                item.Id,
                item.DataItemId,
                item.StorageProvider ?? string.Empty,
                item.ObjectKey ?? string.Empty,
                item.OriginalWidth,
                item.OriginalHeight)
        };

        return ServiceResponse<List<AnnotatorTaskItemResponse>>.Success(items, "OK");
    }

    public async Task<ServiceResponse<List<LabelResponse>>> GetTaskLabelsAsync(string userId, string taskId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<List<LabelResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<List<LabelResponse>>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks
            .AsNoTracking()
            .Select(x => new { x.Id, x.ProjectId, x.AnnotatorId })
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<List<LabelResponse>>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<List<LabelResponse>>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var labels = await dbContext.Labels
            .AsNoTracking()
            .Where(x => x.ProjectId == task.ProjectId)
            .OrderBy(x => x.YoloClassId)
            .ThenBy(x => x.Name)
            .Select(x => new LabelResponse(x.Id, x.Name, x.YoloClassId))
            .ToListAsync();

        return ServiceResponse<List<LabelResponse>>.Success(labels, "OK");
    }

    public async Task<ServiceResponse<ProjectGuidelineResponse>> GetTaskGuidelineAsync(string userId, string taskId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks
            .AsNoTracking()
            .Select(x => new { x.Id, x.ProjectId, x.AnnotatorId })
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var project = await dbContext.Projects
            .AsNoTracking()
            .Where(x => x.Id == task.ProjectId)
            .Select(x => new { x.Id, x.Guideline })
            .FirstOrDefaultAsync();

        if (project is null)
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.NotFound, ["Project not found"]);
        }

        return ServiceResponse<ProjectGuidelineResponse>.Success(
            new ProjectGuidelineResponse(project.Id, project.Guideline),
            "OK");
    }

    public async Task<ServiceResponse<TaskDataItemStorageResponse>> GetTaskDataItemStorageAsync(
        string userId,
        string itemId, // Đây là ID của DataItem
        CancellationToken cancellationToken)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (itemId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
            return ServiceResponse<TaskDataItemStorageResponse>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);

        if (string.IsNullOrWhiteSpace(id))
            return ServiceResponse<TaskDataItemStorageResponse>.Failure("Invalid item", ["Item id is required"]);

        var item = await dbContext.DataItems
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.StorageProvider,
                x.ObjectKey,
                // Check quyền: User phải có Task nào đó trỏ tới ItemId này
                IsAssigned = dbContext.LabelingTasks.Any(t => t.DataItemId == x.Id && t.AnnotatorId == uid)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (item is null)
            return ServiceResponse<TaskDataItemStorageResponse>.Failure(ErrorMessages.NotFound, ["Data item not found in database"]);

        if (!item.IsAssigned)
            return ServiceResponse<TaskDataItemStorageResponse>.Failure(ErrorMessages.Forbidden, ["You do not have permission to access this image"]);

        if (string.IsNullOrWhiteSpace(item.StorageProvider) || string.IsNullOrWhiteSpace(item.ObjectKey))
            return ServiceResponse<TaskDataItemStorageResponse>.Failure(ErrorMessages.NotFound, ["Image path (ObjectKey) is missing"]);

        return ServiceResponse<TaskDataItemStorageResponse>.Success(
            new TaskDataItemStorageResponse(item.StorageProvider, item.ObjectKey),
            "Success");
    }

    public async Task<ServiceResponse<List<AnnotatorAnnotationResponse>>> GetTaskAnnotationsAsync(string userId, string taskId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var sets = await dbContext.AnnotationSets
            .AsNoTracking()
            .Where(x => x.TaskId == id && x.CreatedByUserId == uid)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new { x.Id, x.Status, x.CreatedAt })
            .ToListAsync();

        var draftSet = sets.FirstOrDefault(x => string.Equals(x.Status, "Draft", StringComparison.OrdinalIgnoreCase));
        var submittedSet = sets.FirstOrDefault(x => string.Equals(x.Status, "Submitted", StringComparison.OrdinalIgnoreCase));

        var setIds = new List<string>(2);
        if (draftSet is not null) setIds.Add(draftSet.Id);
        if (submittedSet is not null) setIds.Add(submittedSet.Id);

        if (setIds.Count == 0)
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Success([], "OK");
        }

        var annotations = await dbContext.Annotations
            .AsNoTracking()
            .Where(x => setIds.Contains(x.AnnotationSetId))
            .Select(x => new { x.Id, x.AnnotationSetId, x.LabelId, x.GeometryData, x.CreatedAt, x.UpdatedAt })
            .ToListAsync();

        var submittedAt = submittedSet?.CreatedAt;

        var response = annotations
            .Select(x => new AnnotatorAnnotationResponse(
                x.Id,
                x.LabelId,
                x.GeometryData,
                IsDraft: draftSet is not null && string.Equals(x.AnnotationSetId, draftSet.Id, StringComparison.Ordinal),
                x.CreatedAt,
                x.UpdatedAt,
                SubmittedAt: submittedSet is not null && string.Equals(x.AnnotationSetId, submittedSet.Id, StringComparison.Ordinal) ? submittedAt : null))
            .OrderByDescending(x => x.IsDraft)
            .ThenByDescending(x => x.UpdatedAt)
            .ToList();

        return ServiceResponse<List<AnnotatorAnnotationResponse>>.Success(response, "OK");
    }

    public Task<ServiceResponse<bool>> SaveTaskAnnotationsDraftAsync(string userId, string taskId, UpsertTaskItemAnnotationsRequest request)
        => UpsertTaskAnnotationsAsync(userId, taskId, request, isDraft: true);

    public Task<ServiceResponse<bool>> SubmitTaskAnnotationsAsync(string userId, string taskId, UpsertTaskItemAnnotationsRequest request)
        => UpsertTaskAnnotationsAsync(userId, taskId, request, isDraft: false);

    private async Task<ServiceResponse<bool>> UpsertTaskAnnotationsAsync(
        string userId,
        string taskId,
        UpsertTaskItemAnnotationsRequest request,
        bool isDraft)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<bool>.Failure("Invalid task", ["Task id is required"]);
        }

        var task = await dbContext.LabelingTasks
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AnnotatorId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        var labelIds = request.Objects
            .Select(x => (x.LabelId ?? string.Empty).Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct(StringComparer.Ordinal)
            .ToList();

        if (labelIds.Count == 0)
        {
            return ServiceResponse<bool>.Failure("Invalid annotations", ["At least one object is required"]);
        }

        var projectId = task.ProjectId;
        var validLabelIds = await dbContext.Labels
            .AsNoTracking()
            .Where(x => x.ProjectId == projectId && labelIds.Contains(x.Id))
            .Select(x => x.Id)
            .ToListAsync();

        var missing = labelIds.Except(validLabelIds, StringComparer.Ordinal).ToList();
        if (missing.Count > 0)
        {
            return ServiceResponse<bool>.Failure("Invalid label", missing.Select(x => $"Label not found in project: {x}").ToList());
        }

        var now = DlssTime.VietnamNow;

        var annotationSetStatus = isDraft ? "Draft" : "Submitted";

        AnnotationSet set;

        if (isDraft)
        {
            set = await dbContext.AnnotationSets
                .FirstOrDefaultAsync(x => x.TaskId == id && x.CreatedByUserId == uid && x.Status == annotationSetStatus)
                ?? new AnnotationSet
                {
                    Id = ObjectId.NewObjectId(),
                    TaskId = id,
                    CreatedByUserId = uid,
                    Status = annotationSetStatus
                };

            if (dbContext.Entry(set).State == EntityState.Detached)
            {
                dbContext.AnnotationSets.Add(set);
            }
            else
            {
                var existing = await dbContext.Annotations
                    .Where(x => x.AnnotationSetId == set.Id)
                    .ToListAsync();

                dbContext.Annotations.RemoveRange(existing);
            }
        }
        else
        {
            set = new AnnotationSet
            {
                Id = ObjectId.NewObjectId(),
                TaskId = id,
                CreatedByUserId = uid,
                Status = annotationSetStatus
            };

            dbContext.AnnotationSets.Add(set);
        }

        foreach (var obj in request.Objects)
        {
            var labelId = (obj.LabelId ?? string.Empty).Trim();
            var geometryJson = obj.GeometryData.ValueKind == JsonValueKind.Undefined
                ? string.Empty
                : obj.GeometryData.GetRawText();

            if (string.IsNullOrWhiteSpace(labelId) || string.IsNullOrWhiteSpace(geometryJson))
            {
                continue;
            }

            dbContext.Annotations.Add(new Annotation
            {
                AnnotationSetId = set.Id,
                LabelId = labelId,
                AnnotationType = TryReadGeometryType(geometryJson) ?? "bbox",
                GeometryData = geometryJson,
                Version = 1
            });
        }

        if (string.Equals(task.Status, "Assigned", StringComparison.OrdinalIgnoreCase))
        {
            var oldStatus = task.Status;
            task.Status = "InProgress";
            task.AssignedAt ??= now;

            dbContext.TaskHistories.Add(new TaskHistory
            {
                TaskId = task.Id,
                OldStatus = oldStatus,
                NewStatus = task.Status,
                ChangedByUserId = uid
            });
        }

        if (!isDraft)
        {
            var oldStatus = task.Status;
            task.Status = "Submitted";
            task.CompletedAt = now;

            if (!string.Equals(oldStatus, task.Status, StringComparison.Ordinal))
            {
                dbContext.TaskHistories.Add(new TaskHistory
                {
                    TaskId = task.Id,
                    OldStatus = oldStatus,
                    NewStatus = task.Status,
                    ChangedByUserId = uid
                });
            }
        }

        var predictionId = (request.PredictionId ?? string.Empty).Trim();
        if (!string.IsNullOrWhiteSpace(predictionId))
        {
            var prediction = await dbContext.AiPredictions
                .FirstOrDefaultAsync(x => x.Id == predictionId);

            if (prediction is not null)
            {
                prediction.TaskId = task.Id;
                prediction.IsAccepted = true;
                prediction.Decision = "Accepted";
                prediction.AcceptedByUserId = uid;
                prediction.AcceptedAt = now;
                prediction.AppliedAnnotationSetId = set.Id;
            }
        }

        await dbContext.SaveChangesAsync();
        return ServiceResponse<bool>.Success(true, isDraft ? "Draft saved" : "Submitted");
    }

    private static string? TryReadGeometryType(string geometryJson)
    {
        if (string.IsNullOrWhiteSpace(geometryJson))
        {
            return null;
        }

        try
        {
            using var doc = JsonDocument.Parse(geometryJson);
            if (doc.RootElement.ValueKind != JsonValueKind.Object)
            {
                return null;
            }

            return doc.RootElement.TryGetProperty("type", out var typeProp)
                ? (typeProp.GetString() ?? string.Empty).Trim()
                : null;
        }
        catch
        {
            return null;
        }
    }
}
