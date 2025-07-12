# xUnit Test Patterns Guide

## 🔁 Core Principles
- Test code is production code — optimize for readability, maintainability, and trust
- Isolate units under test (UUT) and test one behavior at a time
- Good tests follow the **Four-Phase Structure**: Setup → Exercise → Verify → Teardown
- Tests should act as specifications — behavior-focused, not implementation-focused
- Refactor test code to reduce duplication and increase intent clarity

## 🧩 Test Patterns
- **Testcase Class per Fixture (TCCF)**: Group tests sharing the same fixture/context
- **Test Data Builders**: Construct complex inputs cleanly and consistently
- **Assertion Messages**: Use descriptive messages to explain failed expectations
- **Behavior Verification**: Use mocks/stubs to validate collaboration behavior
- **Parameterized Tests**: Run the same test logic with different inputs
- **Expected Exception**: Validate failure paths explicitly
- **Fresh Fixture**: Reset all state before each test to avoid interdependence

## ✅ Do
- Follow naming convention: `should<DoSomething>When<Condition>()`
- Use test doubles (Stub, Fake, Mock) intentionally based on need:
  - **Stub**: Provide indirect inputs
  - **Mock**: Verify interaction
  - **Fake**: Lightweight, working implementations (e.g., in-memory DB)
- Prefer **state verification** for pure logic; **behavior verification** for collaborations
- Use builders to manage input complexity and focus tests on behavior
- Minimize setup complexity by refactoring shared setup into helpers/builders
- Keep assertion count per test minimal — one behavior, one test
- Assert the *most significant* behavior to reduce noise and brittleness

## 🚫 Don’t
- Don’t use real external dependencies (DB, network) in unit tests
- Don’t reuse mutable global fixtures — always prefer fresh setup
- Don’t assert on multiple unrelated behaviors in the same test
- Don’t write tests that mirror implementation — focus on *observable behavior*
- Don’t assert internals or call private methods
- Don’t suppress or ignore failing tests — fix or remove them
- Don’t log in unit tests — rely on assertions for failure context

## 📚 Codex Use Cases
Codex should apply this guide when:
- Writing unit tests for business logic, usecases, or validation logic
- Structuring test classes and naming test methods
- Refactoring complex tests using setup builders or shared fixtures
- Implementing behavior-driven test specs (e.g., `givenX_whenY_thenZ`)
- Choosing the right type of test double for mocking/injection
- Evaluating or improving existing test coverage and reliability

> Source: *xUnit Test Patterns: Refactoring Test Code — Gerard Meszaros*
