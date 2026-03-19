using Microsoft.EntityFrameworkCore;
using DataLabellingSupportSystem.Api.Database;
using DataLabellingSupportSystem.Api.Models;

namespace DataLabellingSupportSystem.Api.Repository;

public class ErrorTypesRepository(AppDbContext dbContext)
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<List<ErrorType>> GetAll()
    {
        return await _dbContext.ErrorTypes.ToListAsync();
    }

    public async Task<ErrorType> GetById(string id)
    {
        return await _dbContext.ErrorTypes.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task Add(ErrorType r)
    {
        await _dbContext.ErrorTypes.AddAsync(r);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(ErrorType r)
    {
        var result = await _dbContext.ErrorTypes.FirstOrDefaultAsync(a => a.Id == r.Id);
        if (result != null)
        {
            result.Description = r.Description;
            result.ErrorName = r.ErrorName;
        }
        else
        {
            throw new Exception("Record not found");
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(string id)
    {
        var r = await _dbContext.ErrorTypes.FirstOrDefaultAsync(a => a.Id == id);
        if (r == null)
        {
            throw new Exception("Record not found");
        }
        _dbContext.ErrorTypes.Remove(r);
        await _dbContext.SaveChangesAsync();
    }
}