# Microservices Architecture Guide

## 🔁 Core Principles
- Align services with business capabilities (bounded contexts)
- Favor independent deployability — services must be loosely coupled
- Each service owns its data — no shared database
- Embrace infrastructure automation for CI/CD, observability, and service health
- Prefer decentralized governance — allow tech choice per team if aligned with standards
- Isolate failure — prevent cascading outages
- Treat microservices as products, not just APIs

## 🧩 Design Patterns
- **Service per Bounded Context**: Match services to DDD boundaries
- **API Gateway**: Central entry point for routing, auth, rate-limiting
- **Sidecar Pattern**: Co-locate infrastructure features like logging or service mesh
- **Service Discovery**: Dynamic registration and routing between services
- **Consumer-Driven Contracts**: Define expectations between services and validate them in CI
- **Strangler Pattern**: Gradually replace monolith functionality via routing/switching
- **Event-Driven Architecture**: Use messaging to decouple producers from consumers

## ✅ Do
- Design APIs contract-first and version them
- Automate testing, building, and deployment per service
- Ensure services fail fast and surface errors clearly
- Use health checks, metrics, and logs to expose system state
- Isolate test environments and CI pipelines for each service
- Adopt a platform approach — provide scaffolding, CI templates, and shared tooling
- Use lightweight coordination — choreography over orchestration when possible
- Monitor service dependencies to avoid hidden coupling

## 🚫 Don’t
- Don’t share databases or assume synchronous DB-level joins across services
- Don’t introduce microservices without clear operational maturity (observability, CI/CD)
- Don’t build services around technical boundaries (e.g., DAO service, Auth-only service) — use business logic boundaries
- Don’t over-optimize prematurely — start with coarse-grained services if uncertain
- Don’t deploy without tracing, logging, and retry/backoff strategies in place
- Don’t assume REST for all communication — consider messaging, gRPC, GraphQL based on fit

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing backend architectures for distributed systems
- Breaking down a monolith into microservices via the Strangler Pattern
- Defining service boundaries using DDD principles
- Generating boilerplate for isolated service repos (e.g., CI config, API skeletons)
- Suggesting communication protocols based on team/domain needs
- Creating OpenAPI specs or event schemas per service
- Enforcing deployment best practices like health checks and rollout policies

> Source: *Building Microservices — Sam Newman*
