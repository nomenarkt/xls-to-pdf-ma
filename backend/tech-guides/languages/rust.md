# Rust Backend Tech Guide

This guide defines how to implement backend Codex tasks using Rust while aligning with `/backend/AGENT.md` principles.

## 🔧 Stack & Tools

* Language: Rust (2021 edition)
* Runtime: `tokio`
* Web Framework: `axum` (preferred), optionally `actix-web`
* DB Layer: `sqlx` (async, compile-time checks)
* Validation: `validator` crate
* Auth: `jsonwebtoken`, `axum-extra`
* Formatter: `rustfmt`
* Linter: `clippy`
* Static Analysis: `cargo check`, `cargo audit`, `cargo deny`
* Testing:

  * `#[tokio::test]`
  * `reqwest`
  * `assert_eq!`, `mockall`
* Coverage: `cargo tarpaulin`
* Documentation: `rustdoc`, OpenAPI via `utoipa` (optional)

## 📁 Folder Conventions

```
/backend
  /delivery        → HTTP routers & handlers
  /usecase         → Service logic
  /repository      → SQLx, file, or API adapters
  /domain          → Models, DTOs, enums
```

* Avoid tight coupling; prefer traits for abstraction
* Use `mod.rs` or flat module imports for clarity

## 🔗 Interfaces & DI

* Use traits to define usecase and repository contracts:

```rust
#[async_trait]
pub trait UserRepository {
    async fn save(&self, user: &User) -> Result<()>;
}
```

* Inject with Arc<T> or extractor-based state:

```rust
pub struct AppState {
    pub repo: Arc<dyn UserRepository + Send + Sync>,
}
```

## 🧪 Testing Guidelines

* Use `#[tokio::test]` for async tests
* Unit test all logic-heavy functions and trait impls
* Use `reqwest::Client` for integration tests via `axum::Server`
* Validate:

  * 2xx success
  * 4xx errors
  * 401/403 JWT rejection
  * Edge cases and panic recovery

## 🔐 Security & Auth

* Use `jsonwebtoken` with HMAC256 tokens
* Required claims: `userID`, `email`, `role`
* Extract with axum extractors or custom middleware:

```rust
pub async fn extract_user(claims: Claims) -> Result<User> {
    // Validate role/expiration/etc
}
```

## 🚦 CI/CD Expectations

* Format: `cargo fmt --all -- --check`
* Lint: `cargo clippy -- -D warnings`
* Test: `cargo test --all`
* Coverage: `cargo tarpaulin --ignore-tests`
* CI must block on format, lint, and test failures

## 📌 Examples

### Usecase Trait

```rust
#[async_trait]
pub trait StoreUserUsecase {
    async fn execute(&self, user: UserDTO) -> Result<()>;
}
```

### Handler

```rust
pub async fn store_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UserDTO>
) -> impl IntoResponse {
    state.usecase.execute(payload).await?;
    Json(json!({"status": "success"}))
}
```

---

Follow this guide for all Rust backend work. For global patterns and Codex discipline, defer to `/backend/AGENT.md`.

