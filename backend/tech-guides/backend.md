# Backend – Shared Execution Guide

This guide defines backend implementation rules that apply to **all runtimes** (Go, Python, .NET, Java, Rust, etc.) unless overridden by a language-specific tech guide.

Refer to this file when:

* No `{language}.md` exists yet
* Language-specific conventions are silent
* Codex tasks require global alignment (e.g., folder layout, auth claims, CI expectations)

## 📁 Folder Structure (Clean Architecture)

```
/backend
  /delivery     → HTTP handlers or RPC entrypoints
  /usecase      → Business logic, DTOs, orchestration
  /repository   → DB or external API integration
  /domain       → (optional) core entities, enums, value objects
```

✅ Rules:

* No business logic in `delivery`
* Repositories must implement interfaces (usecase-facing)
* Usecase must not depend on DB drivers or frameworks
* All shared env accessors must live in `/backend/internal/infrastructure`, never duplicated in `/cmd`. Each language must implement a typed `LoadEnv()` (or equivalent) function in that location. This function should:

  * Read environment variables (typically from a `.env` file loaded at runtime)
  * Validate required keys and provide defaults
  * Return a typed config object

> Codex must ensure all CLI entrypoints and HTTP servers call `LoadEnv()` during bootstrap, and must never reference `os.Getenv()` or equivalent outside this function. This enforces a secure, reusable, and testable configuration layer across all runtimes.

## 🔐 Auth & JWT Claims

All requests must pass through middleware that validates JWT and injects user info into context.

Required claims:

```json
{
  "userID": "uuid",
  "email": "user@example.com",
  "role": "admin | pharmacist | ..."
}
```

* Claims must be available in `context.Context`, `request.user`, or equivalent.
* Authorization must be enforced at the usecase layer.

## 🥪 Test Protocol

All APIs must include:

* Unit tests: logic in isolation (usecase, repo)
* Integration tests: full stack using test server
* Edge cases: invalid input, auth errors, role guards
* Coverage: 90% minimum

Use project stack’s best tools (`pytest`, `httptest`, `TestServer`, etc.)

## 🚦 CI/CD Expectations

All PRs must pass:

* Formatter (e.g., `go fmt`, `black`, `dotnet format`)
* Linter (e.g., `golangci-lint`, `flake8`, `spotbugs`)
* Static Analysis (e.g., `mypy`, `checkstyle`, `cargo clippy`)
* Test Runner (language-native)
* Coverage Gate (>90%)

Optional:

* OpenAPI generation (FastAPI, SpringDoc, etc.)
* Type checking (e.g., MyPy, staticcheck)

## 📦 Codex Principles (Reminder)

* Use the `/delivery → /usecase → /repository` flow.
* Always receive input from spec — do not invent behavior.
* Keep handlers thin and usecases fat.
* Inject all dependencies via interfaces or constructors.
* Return structured errors, not raw messages.

---

This guide helps Codex operate safely across stacks and ensures backend quality even before language guides are complete.

