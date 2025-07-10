# Golang Backend Tech Guide

This guide defines how to implement backend Codex tasks using Go while adhering to the architectural principles outlined in `/backend/AGENT.md`.

## 🔧 Stack & Tools

* Language: Go 1.21+
* Modules: Go Modules (use real project path in `go.mod`)
* HTTP Router: `chi`, `echo`, or `net/http` (must be consistent project-wide)
* Database: `pgx`, `gorm`, or raw `database/sql`
* Validation: `go-playground/validator`
* JWT Auth: `github.com/golang-jwt/jwt/v5`
* Formatter: `go fmt`, `goimports`
* Linter: `golangci-lint`
* Static Analysis: `govet`, `staticcheck`
* Dependency Injection: Manual constructor-based DI
* Documentation: Inline GoDoc and optionally `swaggo/swag` for OpenAPI
* Testing: `testing`, `httptest`, `stretchr/testify`
* Coverage: `go test -cover`, `coverprofile`

## 📁 Folder Conventions

Follow `/backend` Clean Architecture:

```
/backend
  /delivery        → HTTP handlers
  /usecase         → Business logic (pure functions)
  /repository      → DB adapters
  /domain          → Entities, value objects (optional)
```

* `go.mod` path must match your repo path
* Imports must not break Clean Architecture

## 🔗 Interfaces & DI

Define interfaces at the `usecase` or `repository` layer:

```go
type UserRepository interface {
    Save(ctx context.Context, u *User) error
}
```

Use constructor DI for handlers and services:

```go
func NewUserHandler(u Usecase) *UserHandler {
    return &UserHandler{usecase: u}
}
```

## 🧪 Testing Guidelines

* Unit test all handlers, usecases, and repositories
* Use table-driven tests (`t.Run()` per case)
* Use `httptest.NewServer` for integration testing
* Validate:

  * Happy paths
  * 400 validation errors
  * 401/403 missing/invalid JWT
  * Edge and failure cases

### Test Stack

* `testing`, `stretchr/testify`, `httptest`
* Use `context.Background()` or testable context injection
* Avoid global state or mocks outside test scope

## 🔐 Security & Auth

* Use middleware to parse JWT and inject claims into context
* Claims required: `userID`, `email`, `role`
* Use context-based auth injection:

```go
ctx := context.WithValue(r.Context(), auth.KeyUserID, userID)
```

* Perform role checks in usecase or validated handler entry

## 🚦 CI/CD Expectations

* All code must pass:

  * `go fmt` / `goimports`
  * `golangci-lint run`
  * `go test ./... -cover`
* Coverage must exceed 90% before merge
* CI should use `.golangci.yml` and include `go vet`, `staticcheck`

## 📌 Examples

### Usecase interface

```go
type StoreUserUsecase interface {
    Execute(ctx context.Context, user *UserDTO) error
}
```

### Handler

```go
func (h *UserHandler) Store(w http.ResponseWriter, r *http.Request) {
    var user UserDTO
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "invalid input", http.StatusBadRequest)
        return
    }

    ctx := r.Context()
    if err := h.usecase.Execute(ctx, &user); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
```

---

Follow this tech guide for all Golang-based backend tasks. For Codex protocols and architecture alignment, refer to `/backend/AGENT.md`.

