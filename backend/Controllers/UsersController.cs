using DataLabellingSupportSystem.Api.Common.Constants;
using DataLabellingSupportSystem.Api.Common.Results;
using DataLabellingSupportSystem.Api.DTOs.Requests.Users;
using DataLabellingSupportSystem.Api.DTOs.Responses.Users;
using DataLabellingSupportSystem.Api.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataLabellingSupportSystem.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController(IUsersService usersService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceResponse<List<UserResponse>>>> GetAll()
    {
        var result = await usersService.GetAllAsync();
        return this.ToOkOrBadRequest(result);
    }

    [HttpGet("{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceResponse<UserResponse>>> GetById([FromRoute] string userId)
    {
        var result = await usersService.GetByIdAsync(userId);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return result.Message == ErrorMessages.NotFound
            ? NotFound(result)
            : BadRequest(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceResponse<UserResponse>>> Create([FromBody] CreateUserRequest request)
    {
        var result = await usersService.CreateAsync(request);
        return this.ToOkOrBadRequest(result);
    }

    [HttpPut("{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceResponse<UserResponse>>> Update([FromRoute] string userId, [FromBody] UpdateUserRequest request)
    {
        var result = await usersService.UpdateAsync(userId, request);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return result.Message == ErrorMessages.NotFound
            ? NotFound(result)
            : BadRequest(result);
    }

    [HttpDelete("{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceResponse<bool>>> Delete([FromRoute] string userId)
    {
        var result = await usersService.DeleteAsync(userId);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return result.Message == ErrorMessages.NotFound
            ? NotFound(result)
            : BadRequest(result);
    }
}
