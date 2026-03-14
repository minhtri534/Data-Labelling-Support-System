using DataLabellingSupportSystem.Api.Common.Constants;
using DataLabellingSupportSystem.Api.Common.Extensions;
using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.DTOs.Requests.Annotator;
using DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;
using DataLabellingSupportSystem.Api.Services.Annotator;
using DataLabellingSupportSystem.Api.Services.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataLabellingSupportSystem.Api.Controllers;

[ApiController]
[Route("api/annotator")]
[Authorize(Roles = "Annotator")]
public sealed class AnnotatorController(IAnnotatorService annotatorService, IStorageService storageService) : ControllerBase
{
    [HttpGet("tasks")]
    public async Task<ActionResult<ServiceResponse<List<AnnotatorTaskSummaryResponse>>>> GetMyTasks()
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<List<AnnotatorTaskSummaryResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.GetMyTasksAsync(userId);
        return this.ToOkOrBadRequest(result);
    }

    [HttpPost("tasks/{taskId}/start")]
    public async Task<ActionResult<ServiceResponse<bool>>> StartTask([FromRoute] string taskId)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.StartTaskAsync(userId, taskId);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpGet("tasks/{taskId}/items")]
    public async Task<ActionResult<ServiceResponse<List<AnnotatorTaskItemResponse>>>> GetTaskItems([FromRoute] string taskId)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<List<AnnotatorTaskItemResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.GetTaskItemsAsync(userId, taskId);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpGet("tasks/{taskId}/labels")]
    public async Task<ActionResult<ServiceResponse<List<LabelResponse>>>> GetTaskLabels([FromRoute] string taskId)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<List<LabelResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.GetTaskLabelsAsync(userId, taskId);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpGet("tasks/{taskId}/guideline")]
    public async Task<ActionResult<ServiceResponse<ProjectGuidelineResponse>>> GetTaskGuideline([FromRoute] string taskId)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<ProjectGuidelineResponse>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.GetTaskGuidelineAsync(userId, taskId);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpGet("task-items/{taskItemId}/data-item/content")]
    public async Task<IActionResult> OpenDataItemContent([FromRoute] string taskItemId, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var dataItemResult = await annotatorService.GetTaskItemDataItemStorageAsync(userId, taskItemId, cancellationToken);
        if (!dataItemResult.IsSuccess)
        {
            return string.Equals(dataItemResult.Message, ErrorMessages.NotFound, StringComparison.Ordinal)
                ? NotFound()
                : StatusCode(StatusCodes.Status403Forbidden);
        }

        var opened = await storageService.OpenReadAsync(
            dataItemResult.Data!.StorageProvider,
            dataItemResult.Data!.ObjectKey,
            cancellationToken);
        if (opened is null)
        {
            return NotFound();
        }

        return File(opened.Value.Stream, opened.Value.ContentType, opened.Value.FileName);
    }

    [HttpGet("task-items/{taskItemId}/annotations")]
    public async Task<ActionResult<ServiceResponse<List<AnnotatorAnnotationResponse>>>> GetTaskItemAnnotations([FromRoute] string taskItemId)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<List<AnnotatorAnnotationResponse>>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.GetTaskItemAnnotationsAsync(userId, taskItemId);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpPut("task-items/{taskItemId}/annotations/draft")]
    public async Task<ActionResult<ServiceResponse<bool>>> SaveDraft(
        [FromRoute] string taskItemId,
        [FromBody] UpsertTaskItemAnnotationsRequest request)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.SaveTaskItemAnnotationsDraftAsync(userId, taskItemId, request);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }

    [HttpPost("task-items/{taskItemId}/annotations/submit")]
    public async Task<ActionResult<ServiceResponse<bool>>> Submit(
        [FromRoute] string taskItemId,
        [FromBody] UpsertTaskItemAnnotationsRequest request)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ServiceResponse<bool>.Failure(ErrorMessages.Unauthorized, ["Missing user id claim"]));
        }

        var result = await annotatorService.SubmitTaskItemAnnotationsAsync(userId, taskItemId, request);
        return this.ToOkOrStatusCode(result, StatusCodes.Status403Forbidden);
    }
}
