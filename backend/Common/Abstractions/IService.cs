using DataLabellingSupportSystem.Api.Common.Results;

namespace DataLabellingSupportSystem.Api.Common.Abstractions;

public interface IService<TDto> where TDto : class
{
    Task<ServiceResponse<IEnumerable<TDto>>> GetAllAsync();
    Task<ServiceResponse<TDto>> GetByIdAsync(int id);
    Task<ServiceResponse<TDto>> CreateAsync(TDto dto);
    Task<ServiceResponse<TDto>> UpdateAsync(int id, TDto dto);
    Task<ServiceResponse<bool>> DeleteAsync(int id);
}
