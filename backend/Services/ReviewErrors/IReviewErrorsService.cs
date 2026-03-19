using DataLabellingSupportSystem.Api.Models;

namespace DataLabellingSupportSystem.Api.Services.ReviewErrors;

public interface IReviewErrorsService
{
    Task<List<ReviewError>> GetAll();
    Task<List<ReviewError>> GetByReviewId(string id);
    Task<List<ReviewError>> GetByErrorTypeId(string id);
    Task AddReviewError(ReviewError reviewError);
    Task DeleteReviewError(ReviewError reviewError);
}
