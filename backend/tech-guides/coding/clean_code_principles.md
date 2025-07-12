# Clean Code Principles

## 🔁 Core Principles
- Code is read far more often than it is written — optimize for readability
- Functions should do one thing and do it well
- Clarity is more important than cleverness
- Prefer intention-revealing names over documentation
- Maintain small scope — small classes, short methods, narrow interfaces
- Clean code honors the Single Responsibility Principle (SRP) at every level
- Treat tests as first-class citizens of the codebase

## 🧩 Design Patterns and Naming Strategies
- **Command-Query Separation**: Functions should either do something (command) or answer something (query), not both
- **Stepdown Rule**: High-level code should appear at the top, details should be stepped down
- **Function Argument Patterns**:
  - 0–2 arguments max
  - Use object parameters for related arguments (e.g., config structs)
  - Avoid flag arguments (e.g., `true/false`)
- **Test Naming**: `shouldX_whenY` or `givenX_thenY`

## ✅ Do
- Use descriptive, consistent names — domain language over technical jargon
- Limit method length (~5–20 lines max)
- Keep classes focused and small (~100–200 lines)
- Write tests for all production code
- Separate concerns clearly: avoid mixing IO, logic, and formatting
- Remove dead/commented code regularly
- Refactor mercilessly when adding features or fixing bugs
- Comment only to explain *why*, never *what* the code does
- Use meaningful commit messages for traceability

## 🚫 Don’t
- Don’t use ambiguous names like `data`, `temp`, `handle` — prefer names that express intent
- Don’t use magic numbers or string literals — extract as named constants
- Don’t write functions with side effects unless absolutely necessary
- Don’t put multiple responsibilities in one method/class
- Don’t optimize prematurely — first make it work, then make it clean, then fast if needed
- Don’t use comments to justify bad code — refactor instead
- Don’t leave test code unmaintained — test code is production code

## 📚 Codex Use Cases
Codex should apply this guide when:
- Refactoring legacy code to be readable and testable
- Reviewing pull requests for naming, function size, clarity
- Writing new business logic — ensure one responsibility per method/class
- Scaffolding test suites — follow clean test naming and isolation practices
- Generating code with clean abstractions and minimal duplication
- Enforcing SRP, naming rules, and clarity in all generated or reviewed logic

> Source: *Clean Code Collection — Robert C. Martin*
