using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.DTOs.Requests.Annotator;
using DataLabellingSupportSystem.Api.DTOs.Responses.Annotator;

namespace DataLabellingSupportSystem.Api.Services.Annotator;

public interface IAnnotatorService
{
    Task<ServiceResponse<List<AnnotatorTaskSummaryResponse>>> GetMyTasksAsync(string userId);
    Task<ServiceResponse<bool>> StartTaskAsync(string userId, string taskId);
    Task<ServiceResponse<List<AnnotatorTaskItemResponse>>> GetTaskItemsAsync(string userId, string taskId);
    Task<ServiceResponse<List<LabelResponse>>> GetTaskLabelsAsync(string userId, string taskId);
    Task<ServiceResponse<ProjectGuidelineResponse>> GetTaskGuidelineAsync(string userId, string taskId);
    Task<ServiceResponse<TaskItemDataItemStorageResponse>> GetTaskItemDataItemStorageAsync(string userId, string taskItemId, CancellationToken cancellationToken);
    Task<ServiceResponse<List<AnnotatorAnnotationResponse>>> GetTaskItemAnnotationsAsync(string userId, string taskItemId);
    Task<ServiceResponse<bool>> SaveTaskItemAnnotationsDraftAsync(string userId, string taskItemId, UpsertTaskItemAnnotationsRequest request);
    Task<ServiceResponse<bool>> SubmitTaskItemAnnotationsAsync(string userId, string taskItemId, UpsertTaskItemAnnotationsRequest request);
}
