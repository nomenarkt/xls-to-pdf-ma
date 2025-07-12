# Clean Architecture Principles

## 🔁 Core Principles
- **Dependency Inversion**: Source code dependencies must point only inward. Inner layers define interfaces; outer layers implement them.
- **Separation of Concerns**: Organize code into layers: Entities, Use Cases, Interface Adapters, and Frameworks.
- **Independence**: Core logic is independent of frameworks, UIs, databases, and external systems.
- **Testability**: Business rules can be tested without UI, database, or web server.
- **Screaming Architecture**: Folder structure and naming should reveal intent and domain, not technical choices.
- **Use Cases as First-Class Citizens**: Application-specific business rules reside here, coordinating entities and infrastructure.

## 🧩 Design Patterns
- **Entity–Use Case–Interface Adapters–Frameworks layering**
- **Input and Output Boundaries**: Define usecase-level input/output interfaces, implemented in outer layers.
- **Gateways**: Adapters for data persistence or external services, injected via interfaces.
- **Presenters**: Format output from usecases for delivery layers.
- **Interactors**: Implement usecases, coordinating entities and boundaries.
- **Dependency Rule Enforcement**: Inner layers must not know anything about outer layers.

## ✅ Do
- Structure projects around domain/usecase boundaries, not technical concerns
- Create clear interfaces for DBs, APIs, or UI interactions
- Isolate business logic in `usecase` layer, away from controllers or data access
- Treat frameworks as replaceable tools — not part of the core system
- Use DTOs to prevent leakage of internal models to external consumers
- Cover usecases and entities with unit tests
- Treat controllers and handlers as delegators — validate, decode, and hand off

## 🚫 Don’t
- Place business logic in HTTP handlers, controllers, or services
- Allow usecases or entities to import database, HTTP, or framework code
- Rely on ORMs or database models in usecases
- Use framework annotations or decorators inside core business code
- Skip input/output boundary interfaces — they’re essential for testability and decoupling
- Confuse delivery/transport logic with application rules

## 📚 Codex Use Cases
Codex should use this guide when:
- Designing backend services with clear layer separation
- Writing usecases that orchestrate domain logic
- Reviewing PRs for violations of the dependency rule
- Generating service directory structure: `delivery → usecase → repository`
- Testing usecases and entities without database, HTTP server, or third-party dependencies
- Enforcing isolation of business logic from transport or persistence concerns

> Source: *Clean Architecture — Robert C. Martin*
