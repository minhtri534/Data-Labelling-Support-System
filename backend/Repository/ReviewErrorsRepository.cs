using Microsoft.EntityFrameworkCore;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.Models;

namespace DataLabellingSupportSystem.Api.Repository;

public class ReviewErrorsRepository(AppDbContext dbContext)
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<List<ReviewError>> GetAll()
    {
        return await _dbContext.ReviewErrors.ToListAsync();
    }

    public async Task<List<ReviewError>> GetByReviewId(string id)
    {
        return await _dbContext.ReviewErrors.Where(a => a.ReviewId == id).ToListAsync();
    }

    public async Task<List<ReviewError>> GetByErrorTypeId(string id)
    {
        return await _dbContext.ReviewErrors.Where(a => a.ErrorTypeId == id).ToListAsync();
    }

    public async Task Add(ReviewError r)
    {
        await _dbContext.ReviewErrors.AddAsync(r);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(ReviewError r)
    {
        var result = await _dbContext.ReviewErrors.FirstOrDefaultAsync(a => a.ReviewId == r.ReviewId && a.ErrorTypeId == r.ErrorTypeId);
        if (result == null)
        {
            throw new Exception("Record not found");
        }
        _dbContext.ReviewErrors.Remove(r);
        await _dbContext.SaveChangesAsync();
    }
}