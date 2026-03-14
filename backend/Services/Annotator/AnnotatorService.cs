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
            .Where(x => x.AssignedToUserId == uid)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                Task = x,
                Total = dbContext.LabelingTaskItems.Count(i => i.TaskId == x.Id),
                Submitted = dbContext.LabelingTaskItems.Count(i => i.TaskId == x.Id && i.Status == LabelingTaskItemStatus.Submitted)
            })
            .Select(x => new AnnotatorTaskSummaryResponse(
                x.Task.Id,
                x.Task.Name,
                x.Task.ProjectId,
                x.Task.DatasetId,
                (int)x.Task.Status,
                x.Total,
                x.Submitted,
                x.Task.CreatedAt,
                x.Task.UpdatedAt,
                x.Task.DueAt))
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

        if (!string.Equals(task.AssignedToUserId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"]);
        }

        if (task.Status == LabelingTaskStatus.Assigned)
        {
            task.Status = LabelingTaskStatus.InProgress;
        }

        if (task.StartedAt is null)
        {
            task.StartedAt = DlssTime.VietnamNow;
        }

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

        var taskOwned = await dbContext.LabelingTasks.AsNoTracking().AnyAsync(x => x.Id == id && x.AssignedToUserId == uid);
        if (!taskOwned)
        {
            var exists = await dbContext.LabelingTasks.AsNoTracking().AnyAsync(x => x.Id == id);
            return exists
                ? ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.Forbidden, ["Task is not assigned to you"])
                : ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        var items = await dbContext.LabelingTaskItems
            .AsNoTracking()
            .Where(x => x.TaskId == id)
            .OrderBy(x => x.OrderIndex)
            .Select(x => new AnnotatorTaskItemResponse(
                x.Id,
                x.DataItemId,
                x.DataItem != null ? x.DataItem.StorageProvider : string.Empty,
                x.DataItem != null ? x.DataItem.ObjectKey : string.Empty,
                x.DataItem != null ? x.DataItem.OriginalWidth : 0,
                x.DataItem != null ? x.DataItem.OriginalHeight : 0,
                (int)x.Status,
                x.CreatedAt,
                x.UpdatedAt,
                x.LastSavedAt,
                x.OrderIndex))
            .ToListAsync();

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
            .Select(x => new { x.Id, x.ProjectId, x.AssignedToUserId })
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<List<LabelResponse>>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AssignedToUserId, uid, StringComparison.Ordinal))
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
            .Select(x => new { x.Id, x.ProjectId, x.AssignedToUserId })
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
        {
            return ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.NotFound, ["Task not found"]);
        }

        if (!string.Equals(task.AssignedToUserId, uid, StringComparison.Ordinal))
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

    public async Task<ServiceResponse<TaskItemDataItemStorageResponse>> GetTaskItemDataItemStorageAsync(
        string userId,
        string taskItemId,
        CancellationToken cancellationToken)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskItemId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<TaskItemDataItemStorageResponse>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<TaskItemDataItemStorageResponse>.Failure("Invalid task item", ["Task item id is required"]);
        }

        var item = await dbContext.LabelingTaskItems
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new
            {
                AssignedToUserId = x.Task != null ? x.Task.AssignedToUserId : null,
                StorageProvider = x.DataItem != null ? x.DataItem.StorageProvider : null,
                ObjectKey = x.DataItem != null ? x.DataItem.ObjectKey : null
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (item is null)
        {
            return ServiceResponse<TaskItemDataItemStorageResponse>.Failure(ErrorMessages.NotFound, ["Task item not found"]);
        }

        if (!string.Equals(item.AssignedToUserId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<TaskItemDataItemStorageResponse>.Failure(ErrorMessages.Forbidden, ["Task item is not assigned to you"]);
        }

        if (string.IsNullOrWhiteSpace(item.StorageProvider) || string.IsNullOrWhiteSpace(item.ObjectKey))
        {
            return ServiceResponse<TaskItemDataItemStorageResponse>.Failure(ErrorMessages.NotFound, ["Data item not found"]);
        }

        return ServiceResponse<TaskItemDataItemStorageResponse>.Success(
            new TaskItemDataItemStorageResponse(item.StorageProvider, item.ObjectKey),
            "OK");
    }

    public async Task<ServiceResponse<List<AnnotatorAnnotationResponse>>> GetTaskItemAnnotationsAsync(string userId, string taskItemId)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskItemId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure("Invalid task item", ["Task item id is required"]);
        }

        var taskItem = await dbContext.LabelingTaskItems
            .AsNoTracking()
            .Include(x => x.Task)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (taskItem?.Task is null)
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.NotFound, ["Task item not found"]);
        }

        if (!string.Equals(taskItem.Task.AssignedToUserId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.Forbidden, ["Task item is not assigned to you"]);
        }

        var annotations = await dbContext.Annotations
            .AsNoTracking()
            .Where(x => x.TaskItemId == id && x.CreatedByUserId == uid)
            .OrderByDescending(x => x.IsDraft)
            .ThenByDescending(x => x.UpdatedAt)
            .Select(x => new AnnotatorAnnotationResponse(
                x.Id,
                x.LabelId,
                x.GeometryData,
                x.IsDraft,
                x.CreatedAt,
                x.UpdatedAt,
                x.SubmittedAt))
            .ToListAsync();

        return ServiceResponse<List<AnnotatorAnnotationResponse>>.Success(annotations, "OK");
    }

    public Task<ServiceResponse<bool>> SaveTaskItemAnnotationsDraftAsync(string userId, string taskItemId, UpsertTaskItemAnnotationsRequest request)
        => UpsertTaskItemAnnotationsAsync(userId, taskItemId, request, isDraft: true);

    public Task<ServiceResponse<bool>> SubmitTaskItemAnnotationsAsync(string userId, string taskItemId, UpsertTaskItemAnnotationsRequest request)
        => UpsertTaskItemAnnotationsAsync(userId, taskItemId, request, isDraft: false);

    private async Task<ServiceResponse<bool>> UpsertTaskItemAnnotationsAsync(
        string userId,
        string taskItemId,
        UpsertTaskItemAnnotationsRequest request,
        bool isDraft)
    {
        var uid = (userId ?? string.Empty).Trim();
        var id = (taskItemId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(uid))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id"]);
        }

        if (string.IsNullOrWhiteSpace(id))
        {
            return ServiceResponse<bool>.Failure("Invalid task item", ["Task item id is required"]);
        }

        var taskItem = await dbContext.LabelingTaskItems
            .Include(x => x.Task)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (taskItem?.Task is null)
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.NotFound, ["Task item not found"]);
        }

        if (!string.Equals(taskItem.Task.AssignedToUserId, uid, StringComparison.Ordinal))
        {
            return ServiceResponse<bool>.Failure(ErrorMessages.Forbidden, ["Task item is not assigned to you"]);
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

        var projectId = taskItem.Task.ProjectId;
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

        if (isDraft)
        {
            var existingDrafts = await dbContext.Annotations
                .Where(x => x.TaskItemId == id && x.CreatedByUserId == uid && x.IsDraft)
                .ToListAsync();

            dbContext.Annotations.RemoveRange(existingDrafts);
        }
        else
        {
            var existingByUser = await dbContext.Annotations
                .Where(x => x.TaskItemId == id && x.CreatedByUserId == uid)
                .ToListAsync();

            dbContext.Annotations.RemoveRange(existingByUser);
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
                TaskItemId = taskItem.Id,
                DataItemId = taskItem.DataItemId,
                LabelId = labelId,
                GeometryData = geometryJson,
                CreatedByUserId = uid,
                IsDraft = isDraft,
                SubmittedAt = isDraft ? null : now
            });
        }

        taskItem.LastSavedAt = now;
        taskItem.Status = isDraft ? LabelingTaskItemStatus.Draft : LabelingTaskItemStatus.Submitted;

        if (taskItem.Task.Status == LabelingTaskStatus.Assigned)
        {
            taskItem.Task.Status = LabelingTaskStatus.InProgress;
        }

        taskItem.Task.StartedAt ??= now;

        if (!isDraft)
        {
            var anyRemaining = await dbContext.LabelingTaskItems
                .AsNoTracking()
                .AnyAsync(x => x.TaskId == taskItem.TaskId && x.Status != LabelingTaskItemStatus.Submitted);

            if (!anyRemaining)
            {
                taskItem.Task.Status = LabelingTaskStatus.Submitted;
                taskItem.Task.SubmittedAt = now;
            }
        }

        await dbContext.SaveChangesAsync();
        return ServiceResponse<bool>.Success(true, isDraft ? "Draft saved" : "Submitted");
    }
}
