using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Repository;

namespace DataLabellingSupportSystem.Api.Services.Reviews;

public class ReviewsService(ReviewsRepository repo) : IReviewsService
{
    private readonly ReviewsRepository _repo = repo;

    public async Task AddReview(Review review)
    {
        await _repo.Add(review);
    }

    public async Task<List<Review>> GetAll()
    {
        return await _repo.GetAll();
    }

    public async Task<Review> GetReviewById(string id)
    {
        return await _repo.GetById(id);
    }

    public async Task<List<Review>> GetReviewsByReviewerId(string id)
    {
        var reviews = await _repo.GetAll();
        return reviews.Where(a => a.ReviewerId == id).ToList();
    }

    public async Task UpdateReview(Review review)
    {
        await _repo.Update(review);
    }
}
