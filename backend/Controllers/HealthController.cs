using DataLabellingSupportSystem.Api.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace DataLabellingSupportSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<ServiceResponse<object>> GetHealth()
    {
        var health = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Service = "Data Labelling Support System API"
        };

        return Ok(ServiceResponse<object>.Success(health, "API is running"));
    }
}
