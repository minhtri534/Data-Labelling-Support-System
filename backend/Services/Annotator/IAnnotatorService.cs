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
    Task<ServiceResponse<TaskDataItemStorageResponse>> GetTaskDataItemStorageAsync(string userId, string taskId, CancellationToken cancellationToken);
    Task<ServiceResponse<List<AnnotatorAnnotationResponse>>> GetTaskAnnotationsAsync(string userId, string taskId);
    Task<ServiceResponse<bool>> SaveTaskAnnotationsDraftAsync(string userId, string taskId, UpsertTaskItemAnnotationsRequest request);
    Task<ServiceResponse<bool>> SubmitTaskAnnotationsAsync(string userId, string taskId, UpsertTaskItemAnnotationsRequest request);
}
