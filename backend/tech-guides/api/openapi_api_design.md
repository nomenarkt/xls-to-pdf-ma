# API Design with OpenAPI

## 🔁 Core Principles
- API design is contract-first — define behavior before implementation
- Use OpenAPI to align humans and machines on API expectations
- Consistency and predictability in API design reduces cognitive load
- The API contract is the **single source of truth** — use it to drive mocks, docs, tests, and code
- Design APIs around **resources and use cases**, not internal models

## 🧩 Design Patterns
- **Request/Response Shape**: Model inputs/outputs using JSON Schema
- **Reusable Components**: Define shared parameters, headers, responses under `components/`
- **Error Model**: Use a standard structure (e.g., `code`, `message`, `details`)
- **Pagination Pattern**: Use `limit` and `cursor` query params, with `next` link in response
- **Versioning Strategy**: Use URI versioning (`/v1/users`) or media types (`application/vnd...`)
- **Security Schemes**: Define JWT Bearer, API Key, OAuth flows using OpenAPI `securitySchemes`
- **Operation ID Naming**: Use clear, consistent verbs + resource nouns (e.g., `createUser`, `deleteToken`)

## ✅ Do
- Define `operationId` for each endpoint to drive code generation
- Use `$ref` to avoid duplicating schemas, responses, and parameters
- Include examples for request bodies and responses to improve docs and mocking
- Group endpoints using `tags` to match logical modules or domains
- Use `description` fields to document purpose, constraints, and behaviors
- Treat 422 (Unprocessable Entity) as the canonical validation error response
- Annotate enums, formats, and constraints (`minLength`, `pattern`, etc.) to enforce client/server validation

## 🚫 Don’t
- Don’t expose database model names or internals in your API schema
- Don’t overuse `anyOf`, `oneOf`, or polymorphic schemas — they complicate tooling
- Don’t rely solely on HTTP 200 — use specific status codes (e.g., 201, 204, 404, 422)
- Don’t repeat schema definitions inline — refactor using `components`
- Don’t skip examples — lack of examples hurts client adoption and test automation
- Don’t treat OpenAPI as just documentation — it must drive development contracts

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing or modifying REST APIs with OpenAPI 3+ support
- Generating handlers, clients, or mocks from OpenAPI `operationId`
- Enforcing consistent naming, versioning, and error handling in endpoints
- Refactoring legacy APIs into reusable OpenAPI components
- Creating validation schemas that match backend logic
- Setting up Postman/newman or CI tests from API contracts

> Source: *Designing APIs with Swagger and OpenAPI — Joshua Ponelat & Lukas Rosenstock*
