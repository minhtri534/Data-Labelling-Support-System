using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.DTOs.Requests.Users;
using DataLabellingSupportSystem.Api.DTOs.Responses.Users;

namespace DataLabellingSupportSystem.Api.Services.Users;

public interface IUsersService
{
    Task<ServiceResponse<List<UserResponse>>> GetAllAsync();

    Task<ServiceResponse<UserResponse>> GetByIdAsync(string userId);

    Task<ServiceResponse<UserResponse>> CreateAsync(CreateUserRequest request);

    Task<ServiceResponse<UserResponse>> UpdateAsync(string userId, UpdateUserRequest request);

    Task<ServiceResponse<bool>> DeleteAsync(string userId);
}
