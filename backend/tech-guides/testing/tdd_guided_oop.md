# Test-Guided Object-Oriented Design

## 🔁 Core Principles
- Design and architecture emerge incrementally from well-written tests
- Use tests to explore and constrain desired behavior before writing implementation
- Drive object design by evolving interfaces through usage ("outside-in")
- Separate responsibilities clearly between domain logic and side-effecting infrastructure
- Write only enough production code to make tests pass — avoid speculative design
- Maintain fast, isolated, and expressive tests to support continuous change

## 🧩 Design Patterns and Structures
- **Outside-In TDD**: Start from the system boundary (e.g., controller), then drive the design inward
- **Mock Roles, Not Objects**: Mock based on behavior/contract, not class
- **Ports and Adapters (Hexagonal Architecture)**: Domain code talks to interfaces; adapters implement those interfaces
- **Growing Interfaces**: Extract interfaces from collaboration patterns observed in test-driven usage
- **Layer Split**:
  - **Application Layer**: Orchestrates use cases
  - **Domain Layer**: Core logic, entities, value objects
  - **Infrastructure Layer**: Side effects — DB, messaging, HTTP

## ✅ Do
- Write acceptance tests at system boundaries to guide feature development
- Use collaboration tests (mocks/stubs) to define interface contracts early
- Delay implementation details — mock collaborators to define expected interaction
- Keep test scenarios business-focused and language consistent with domain
- Use test names that describe behavior (e.g., `notifiesCustomer_whenOrderFails()`)
- Refactor both test and production code continuously
- Design APIs from the perspective of the test — make usage intuitive and meaningful

## 🚫 Don’t
- Don’t test internals — focus on behavior, not structure
- Don’t couple tests to implementation details (e.g., class names, specific method chains)
- Don’t overload test suites with irrelevant setup — isolate only what’s needed
- Don’t use mocks to test simple queries or value returns — prefer real objects
- Don’t tightly bind tests to the framework — test your logic, not the platform
- Don’t use integration tests as a substitute for missing unit/collaboration coverage

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing objects and interfaces using TDD
- Writing business-driven unit tests and evolving domain models
- Implementing Clean Architecture or Ports & Adapters layering
- Mocking external services or DBs during domain-layer testing
- Refactoring legacy code by first adding characterization tests
- Choosing between stubs, mocks, or real collaborators based on interaction complexity

> Source: *Growing Object-Oriented Software, Guided by Tests — Freeman & Pryce*
