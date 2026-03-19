using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Repository;

namespace DataLabellingSupportSystem.Api.Services.ReviewErrors;

public class ReviewErrorsService(ReviewErrorsRepository repo) : IReviewErrorsService
{
    private readonly ReviewErrorsRepository _repo = repo;

    public async Task AddReviewError(ReviewError reviewError)
    {
        await _repo.Add(reviewError);
    }

    public async Task DeleteReviewError(ReviewError reviewError)
    {
        await _repo.Delete(reviewError);
    }

    public Task<List<ReviewError>> GetAll()
    {
        return _repo.GetAll();
    }

    public Task<List<ReviewError>> GetByErrorTypeId(string id)
    {
        return _repo.GetByErrorTypeId(id);
    }

    public async Task<List<ReviewError>> GetByReviewId(string id)
    {
        return await _repo.GetByReviewId(id);
    }
}
