# JavaScript Testing Architecture Principles

## 🔁 Core Principles
- Tests must reflect **user behavior**, not internal mechanics
- Code quality improves when tests are **easy to write, read, and change**
- Use testing to enforce **architecture discipline** (layers, contracts)

## 🧩 Design Patterns
- **Test Type Layers**:
  - Unit: Single responsibility, fast, isolated
  - Integration: Components/modules with real dependencies
  - E2E/System: Full flow across UI/API/storage
- **Testing Boundaries**:
  - Use mock boundaries only at infrastructure edges (e.g., network, DB)
  - Avoid mocking internal logic—refactor instead
- **Arrange–Act–Assert**:
  - Arrange: setup all inputs, dependencies
  - Act: trigger one behavior
  - Assert: verify one outcome

## ✅ Do
- Write tests **before or during** feature development
- Use **clear, intent-revealing** test names
- Structure tests like code: grouped by domain, colocated with source
- Favor **public API tests** over internal state checks
- Test edge cases, failure modes, timeouts, race conditions
- Use descriptive helpers (e.g., `createValidUser`, `mockApiError`) to clarify intent
- Use test coverage **as a signal**, not a goal

## 🚫 Don’t
- Don’t test private methods or internal implementations
- Don’t rely on fragile mocks that couple to structure
- Don’t use `console.log` as assertions
- Don’t test libraries (e.g., `React`, `Date`)—test your usage of them
- Don’t mix multiple expectations in one test case

## 📚 Codex Use Cases
Codex should use this when:
- Designing test scaffolding for new features
- Reviewing test PRs for structure, reliability, and clarity
- Building utility libraries for mocking, fixtures, or factories
- Enforcing proper layering (unit vs integration) across stacks
- Auditing legacy code for testability and coverage patterns
