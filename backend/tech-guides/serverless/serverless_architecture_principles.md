# Serverless Architecture Principles

## 🔁 Core Principles
- Build **event-driven, stateless functions** that scale with demand.
- Treat infrastructure as **ephemeral and code-defined**—infrastructure should be disposable and declarative.
- Embrace **small, focused units of execution**—do one thing well.
- Let **cloud services manage infrastructure**: compute, storage, auth, etc.

## 🧩 Design Patterns
- **Function-per-endpoint (API Gateway + Lambda)**:
  - One handler per HTTP route, wrapped in a shared layer.
- **Hexagonal architecture** in serverless:
  - Core logic separated from platform-specific triggers (e.g., HTTP, SQS).
- **Service Composition**:
  - Use managed services (e.g., DynamoDB, S3, Cognito) as functional primitives.
- **Observability Layer**:
  - Add structured logging, tracing, and correlation IDs to all function handlers.

## ✅ Do
- Use `serverless.yml` or `infrastructure-as-code` for defining deployment
- Keep handlers thin—extract business logic into shared modules
- Use environment variables and secrets managers, not hardcoded configs
- Instrument functions with `console.log`, `X-Ray`, or similar for traceability
- Secure endpoints with auth middleware (JWT, Cognito, etc.)
- Apply retries, timeouts, and idempotency for API integrations

## 🚫 Don’t
- Don’t assume local file system or persistent state across invocations
- Don’t overuse large monolithic functions—prefer splitting by concern
- Don’t write handlers with framework-specific coupling (e.g., Express inside Lambda)
- Don’t bypass platform observability—always log structured outputs
- Don’t let functions grow unbounded—set memory and execution limits

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding function-based APIs (e.g., `/api/user/create`)
- Refactoring handlers to isolate business logic from triggers
- Writing tests for pure logic and mocks for AWS services
- Reviewing IaC setups for `serverless.yml`, `CDK`, or `Terraform`
- Applying logging, metrics, and error boundaries to Lambda functions
