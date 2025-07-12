# Test-Driven Development with React

## 🔁 Core Principles
- Write tests **before** implementing components
- Favor **spec-first development**: describe behavior, not implementation
- Every unit of behavior must be testable, predictable, and isolated
- Use tests to **drive design** toward composability and simplicity

## 🧩 Design Patterns
- **Red-Green-Refactor Cycle**:
  - Red: Write a failing test
  - Green: Write the minimal code to pass
  - Refactor: Improve code while keeping tests green
- **Smart vs Dumb Components**:
  - Test logic-heavy smart components via hooks or container components
  - Test UI-only components via props and interaction
- **Component Pyramid**:
  - Unit tests at the base
  - Integration tests in the middle
  - UI snapshots or E2E tests at the top

## ✅ Do
- Co-locate test files with components: `MyComponent.tsx → MyComponent.test.tsx`
- Use React Testing Library to simulate real user interactions (`fireEvent`, `userEvent`)
- Test components via public API (DOM, props), not internal methods or state
- Mock external modules (e.g., API calls) with tools like `msw`, `jest.mock`
- Maintain 100% coverage of logic branches, edge cases, and interactions
- Refactor components into smaller testable units when tests get complex

## 🚫 Don’t
- Don’t test implementation details (e.g., internal state variables)
- Don’t rely on fixed timeouts—use async utilities (`waitFor`, `findBy`)
- Don’t ignore accessibility (use `getByRole`, `getByLabelText`)
- Don’t mix business logic with presentational components
- Don’t skip tests on utility functions or shared hooks

## 📚 Codex Use Cases
Codex should use this when:
- Writing new React components or hooks with TDD workflow
- Refactoring legacy code to isolate logic and add tests
- Reviewing PRs for missing unit/integration test coverage
- Deciding how to split container/presentational logic
- Adding accessibility selectors to improve test resilience
