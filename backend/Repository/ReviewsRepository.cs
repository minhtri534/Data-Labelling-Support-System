using Microsoft.EntityFrameworkCore;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.Models;

namespace DataLabellingSupportSystem.Api.Repository;

public class ReviewsRepository(AppDbContext dbContext)
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<List<Review>> GetAll()
    {
        return await _dbContext.Reviews.ToListAsync();
    }

    public async Task<Review> GetById(string id)
    {
        return await _dbContext.Reviews.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task Add(Review r)
    {
        await _dbContext.Reviews.AddAsync(r);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(Review r)
    {
        var _review = await _dbContext.Reviews.FirstOrDefaultAsync(a => a.Id == r.Id);
        if (_review != null)
        {
            _review.AnnotationSetId = r.AnnotationSetId;
            _review.Comment = r.Comment;
            _review.Result = r.Result;
            _review.ReviewedAt = r.ReviewedAt;
            _review.ReviewerId = r.ReviewerId;
            _review.Score = r.Score;
        }
        else
        {
            throw new Exception("Record not found");
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(string id)
    {
        var r = await _dbContext.Reviews.FirstOrDefaultAsync(a => a.Id == id);
        if (r == null)
        {
            throw new Exception("Record not found");
        }
        _dbContext.Reviews.Remove(r);
        await _dbContext.SaveChangesAsync();
    }
}