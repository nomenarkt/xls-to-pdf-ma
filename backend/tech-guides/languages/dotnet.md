# .NET Backend Tech Guide

This guide defines how to implement backend Codex tasks using the .NET stack while following the architectural principles set by `/backend/AGENT.md`.

## 🔧 Stack & Tools

* Language: C#
* Runtime: .NET 8 or higher
* Frameworks:

  * ASP.NET Core Web API
  * Entity Framework Core (ORM)
  * Microsoft.Extensions.DependencyInjection (DI)
  * FluentValidation (optional)
* Formatter: `dotnet format`
* Linter/Analyzer: Roslyn analyzers, `StyleCop.Analyzers`
* Static Analysis: `dotnet build /warnaserror`, `SonarAnalyzer`, etc.
* Documentation: XML comments, OpenAPI via Swashbuckle
* Testing:

  * xUnit
  * FluentAssertions
  * Microsoft.AspNetCore.Mvc.Testing (`TestServer`)
  * Moq or NSubstitute
* Coverage: `coverlet`, `ReportGenerator`, `dotnet test --collect:"XPlat Code Coverage"`

## 📁 Folder Conventions

Follow `/backend` Clean Architecture:

```
/backend
  /delivery        → Controllers (API endpoints)
  /usecase         → Services, interactors
  /repository      → EFCore, Dapper, DB logic
  /domain          → Entities, value objects, enums
```

* No references from usecase/repo to delivery
* Prefer constructor-based dependency injection

## 🔗 Interfaces & DI

* Define interfaces in `/usecase` or `/repository`
* Register services in `Program.cs`:

```csharp
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IStoreUserUsecase, StoreUserUsecase>();
```

## 🧪 Testing Guidelines

* Unit test all public usecases and repositories
* Use `Moq`/`NSubstitute` for mocks
* Use `TestServer` for controller integration tests
* Validate:

  * 2xx happy paths
  * 4xx validation failures
  * 401/403 auth enforcement
  * Nulls, exceptions, and edge cases

### Test Stack

* xUnit
* FluentAssertions
* Moq or NSubstitute
* TestServer with `WebApplicationFactory`

## 🔐 Security & Auth

* Use JWT bearer middleware (`Microsoft.AspNetCore.Authentication.JwtBearer`)
* Extract claims from `HttpContext.User`
* Map user claims to DTO/model if needed
* Required claims: `userID`, `email`, `role`
* Use `[Authorize(Roles = "...")]` or inline role guards

## 🚦 CI/CD Expectations

* Must pass:

  * `dotnet format`
  * All analyzers and style rules
  * `dotnet test` with coverage report
* Code coverage >90%
* Use GitHub Actions or Azure DevOps with `coverlet`, `ReportGenerator`

## 📌 Examples

### Usecase interface

```csharp
public interface IStoreUserUsecase
{
    Task ExecuteAsync(UserDto user);
}
```

### Controller

```csharp
[Authorize(Roles = "admin")]
[ApiController]
[Route("/api/users")]
public class UserController : ControllerBase
{
    private readonly IStoreUserUsecase _usecase;

    public UserController(IStoreUserUsecase usecase)
    {
        _usecase = usecase;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] UserDto user)
    {
        await _usecase.ExecuteAsync(user);
        return Ok(new { status = "success" });
    }
}
```

---

Follow this tech guide when implementing any `.NET` backend feature to remain aligned with system architecture and Codex execution standards.

For broader patterns, always defer to `/backend/AGENT.md`.

