using DataLabellingSupportSystem.Api.DTOs.Requests.Reviews;
using DataLabellingSupportSystem.Api.Models;
using DataLabellingSupportSystem.Api.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataLabellingSupportSystem.Api.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize]
public sealed class ReviewsController(IReviewsService service) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var result = await service.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await service.GetReviewById(id);
        return Ok(result);
    }

    [HttpGet("reviewer/{id}")]
    [Authorize(Roles = "Reviewer")]
    public async Task<IActionResult> GetByReviewerId(string id)
    {
        var result = await service.GetReviewsByReviewerId(id);
        if (result.Count == 0)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Reviewer")]
    public async Task<IActionResult> AddReview([FromBody] AddReviewRequest r)
    {
        var review = new Review{
            AnnotationSetId = r.AnnotationSetId,
            Comment = r.Comment,
            Result = r.Result,
            ReviewedAt = r.ReviewedAt,
            ReviewerId = r.ReviewerId,
            Score = r.Score
        };
        await service.AddReview(review);
        return Ok();
    }

    [HttpPut]
    [Authorize(Roles = "Reviewer")]
    public async Task<IActionResult> UpdateReview([FromBody] UpdateReviewRequest r)
    {
        var review = new Review{
            Comment = r.Comment,
            Result = r.Result,
            ReviewedAt = r.ReviewedAt,
            Score = r.Score
        };
        await service.UpdateReview(review);
        return Ok();
    }
}
