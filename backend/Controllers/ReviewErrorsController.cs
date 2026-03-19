using DataLabellingSupportSystem.Api.DTOs.Requests.Reviews;
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Services.ReviewErrors;
using DataLabellingSupportSystem.Api.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataLabellingSupportSystem.Api.Controllers;

[ApiController]
[Route("api/review_errors")]
[Authorize]
public sealed class ReviewErrorsController(IReviewErrorsService service) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var result = await service.GetAll();
        return Ok(result);
    }

    [HttpGet("review/{id}")]
    public async Task<IActionResult> GetByReviewId(string id)
    {
        var result = await service.GetByReviewId(id);
        return Ok(result);
    }

    [HttpGet("type/{id}")]
    public async Task<IActionResult> GetByErrorTypeId(string id)
    {
        var result = await service.GetByErrorTypeId(id);
        if (result.Count == 0)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost]

    public async Task<IActionResult> AddReview([FromBody] ReviewError r)
    {
        var reviewError = new ReviewError{
            ErrorTypeId = r.ErrorTypeId,
            ReviewId = r.ReviewId
        };
        await service.AddReviewError(reviewError);
        return Ok();
    }

    [HttpDelete]
    [Authorize(Roles = "Reviewer")]
    public async Task<IActionResult> DeleteReviewError([FromBody] ReviewError r)
    {
        await service.DeleteReviewError(r);
        return Ok();
    }
}
