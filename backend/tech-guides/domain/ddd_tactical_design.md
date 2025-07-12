# Domain-Driven Design Tactical Guide

## 🔁 Core Principles
- Place the domain model at the center of software design
- Align code structure with business language (Ubiquitous Language)
- Encapsulate complex logic within domain models
- Isolate domain logic from infrastructure concerns
- Model around real-world business capabilities, not technical layers
- Ensure deep collaboration between developers and domain experts

## 🧩 Design Patterns
- **Entity**: Has identity and lifecycle (e.g. `Order`, `Customer`)
- **Value Object**: Immutable, equality by value (e.g. `Money`, `Address`)
- **Aggregate**: Cluster of associated objects with a root (aggregate root) controlling invariants
- **Repository**: Interface to access aggregates (abstracts persistence)
- **Factory**: Encapsulates complex creation logic of aggregates
- **Domain Service**: Stateless operation that doesn’t belong to any specific entity
- **Application Service**: Coordinates usecases, delegates to domain layer
- **Module (Bounded Context)**: Defines logical boundaries of domain models and terms

## ✅ Do
- Use **Ubiquitous Language** in method, class, and variable names across model, tests, and documentation
- Design each Aggregate to be transactional and consistent by itself
- Keep Aggregates small and focused — only include invariants that must be enforced together
- Enforce invariants inside the Aggregate Root
- Delegate orchestration logic to Application Services, not inside Aggregates
- Expose only Aggregate Root methods to external consumers (encapsulation)
- Create separate repositories per Aggregate
- Ensure domain logic is unit-testable independent of frameworks
- Refactor toward domain language as understanding evolves

## 🚫 Don’t
- Don’t allow external objects to modify child entities directly
- Don’t put business logic in controllers or persistence adapters
- Don’t model technical database schemas instead of real domain concepts
- Don’t expose ORM entities directly — wrap them with domain logic
- Don’t use generic CRUD repositories — always design around domain needs
- Don’t couple aggregates together — favor referencing by ID

## 📚 Codex Use Cases
Codex should apply this guide when:
- Modeling real-world domains (e.g., banking, logistics, healthcare)
- Structuring services around **business capabilities**, not CRUD endpoints
- Implementing domain logic inside Aggregates and Value Objects
- Designing service boundaries with **Bounded Contexts**
- Enforcing invariants in aggregates, not services
- Translating API calls into **Application Services** which delegate to Aggregates
- Writing domain tests with expressive, behavior-based naming

> Source: *Domain-Driven Design: Tackling Complexity in the Heart of Software – Eric Evans*
