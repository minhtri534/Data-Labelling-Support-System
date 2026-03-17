using System.Text.Json;
using DataLabellingSupportSystem.Api.Common.Constants;
using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.DTOs.Requests.Annotator;
using DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Utils;
using Microsoft.EntityFrameworkCore;

namespace DataLabellingSupportSystem.Api.Services.Annotator;

public sealed partial class AnnotatorService
{
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

        var task = await _dbContext.LabelingTasks
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

        var sets = await _dbContext.AnnotationSets
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

        var annotations = await _dbContext.Annotations
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

        var task = await _dbContext.LabelingTasks
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
        var validLabelIds = await _dbContext.Labels
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
            set = await _dbContext.AnnotationSets
                .FirstOrDefaultAsync(x => x.TaskId == id && x.CreatedByUserId == uid && x.Status == annotationSetStatus)
                ?? new AnnotationSet
                {
                    Id = ObjectId.NewObjectId(),
                    TaskId = id,
                    CreatedByUserId = uid,
                    Status = annotationSetStatus
                };

            if (_dbContext.Entry(set).State == EntityState.Detached)
            {
                _dbContext.AnnotationSets.Add(set);
            }
            else
            {
                var existing = await _dbContext.Annotations
                    .Where(x => x.AnnotationSetId == set.Id)
                    .ToListAsync();

                _dbContext.Annotations.RemoveRange(existing);
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

            _dbContext.AnnotationSets.Add(set);
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

            _dbContext.Annotations.Add(new Annotation
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

            _dbContext.TaskHistories.Add(new TaskHistory
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
                _dbContext.TaskHistories.Add(new TaskHistory
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
            var prediction = await _dbContext.AiPredictions
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

        await _dbContext.SaveChangesAsync();
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
