# Architecture Trade-Off Decision Guide

## 🔁 Core Principles
- Every architecture choice involves trade-offs — optimize based on context, not dogma
- Favor evolutionary architecture: systems must accommodate change
- Decision records (ADR) are first-class citizens — document the *why*, not just the *what*
- Choose architectural components based on cohesion, not just reuse or size
- Delay decisions until the *last responsible moment* to maintain flexibility
- Balance coupling vs. cohesion for modularity at scale
- Design for operational concerns (observability, deployment, governance) upfront

## 🧩 Design Patterns & Strategies
- **Service Granularity Matrix**: Evaluate services based on business capability, volatility, and change frequency
- **Architecture Quantum**: The smallest deployable unit with high autonomy and low external coupling
- **Consumer-Driven Contracts (CDC)**: Let consumers define the contract, enforce via CI
- **Service Mesh**: Use for platform-level concerns (retry, circuit breaking, observability)
- **Domain-Scoped Governance**: Decentralize architectural control within bounded contexts
- **Preapproved Architectural Fitness Functions**: Use automation to validate architecture at runtime
- **Choreography vs Orchestration**: Use choreography for scale, orchestration for control

## ✅ Do
- Define clear bounded contexts to avoid hidden coupling
- Prefer asynchronous communication (event-driven) when team autonomy is a priority
- Enforce SLAs and contract verification as part of CI/CD
- Treat observability (logs, metrics, tracing) as a first-class design goal
- Decompose by *business capabilities*, not technical functions
- Use fitness functions to enforce rules (e.g., package boundaries, latency thresholds)
- Review each decision using the trade-off matrix: Agility, Scalability, Reliability, Complexity, Cost

## 🚫 Don’t
- Don’t break apart services without an explicit granularity evaluation
- Don’t centralize orchestration logic unless consistency demands it
- Don’t make irreversible architecture decisions too early
- Don’t tightly couple services via shared databases or implicit contracts
- Don’t rely on static documentation — automate architectural compliance
- Don’t confuse deployment unit (container) with service boundary (business logic)

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing or reviewing microservices boundaries
- Deciding between REST, gRPC, events, or messaging for inter-service communication
- Enforcing CI-based architectural compliance (e.g., contract tests, latency guards)
- Choosing orchestration (sagas, workflows) vs. event choreography
- Reviewing architecture decisions for explicit trade-off documentation
- Implementing platform capabilities via service mesh or sidecars

> Source: *Software Architecture: The Hard Parts — Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani*
