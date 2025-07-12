# React Testing Library Principles

## 🔁 Core Principles
- Test the **user behavior**, not the implementation details
- Treat components like black boxes with public APIs (DOM, props)
- Ensure test resilience through accessibility-based selectors

## 🧩 Design Patterns
- **Render–Act–Assert Flow**:
  - Render component with props/context
  - Simulate user actions (`userEvent.click`, `type`)
  - Assert visible DOM and accessible changes
- **Custom render wrappers**:
  - Abstract common providers (e.g., context, theme, router) in test utils
- **Test Tags**:
  - Use `getByRole`, `getByLabelText`, or `getByTestId` with intent

## ✅ Do
- Prefer `userEvent` over `fireEvent` for realistic interactions
- Use async utilities (`findBy*`, `waitFor`) for deferred assertions
- Co-locate test files (`Component.tsx → Component.test.tsx`)
- Use screen queries (`screen.getByRole`) for clarity and intent
- Mock network/data with MSW or in-memory handlers
- Ensure full coverage: happy path, edge case, and fallback UI

## 🚫 Don’t
- Don’t assert internal component state (e.g., `wrapper.instance()`)
- Don’t use `querySelector` or `innerHTML` for critical assertions
- Don’t rely on arbitrary timeouts—prefer RTL’s async tools
- Don’t test implementation details like class names or structure

## 📚 Codex Use Cases
Codex should use this when:
- Writing or reviewing React component/unit tests
- Refactoring test suites to improve stability and maintainability
- Validating test coverage and accessibility selectors
- Wrapping test logic with reusable render helpers and mocks
