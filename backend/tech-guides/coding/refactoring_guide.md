# Refactoring Design Guide

## 🔁 Core Principles
- Refactor to improve internal structure without changing external behavior
- Small, safe, continuous improvements beat large risky rewrites
- Refactoring is guided by tests — reliable safety nets enable fearless cleanup
- Code smells are signals, not failures — they guide what to improve
- Naming is refactoring: improve readability by naming intent clearly

## 🧩 Refactoring Patterns
- **Extract Method**: Split complex logic into named sub-functions
- **Inline Variable/Method**: Remove indirection if it hides clarity
- **Replace Temp with Query**: Avoid mutability; prefer function calls
- **Introduce Parameter Object**: Group related parameters
- **Move Method/Field**: Align behavior with where it logically belongs
- **Replace Conditional with Polymorphism**: Use strategy pattern for varying logic
- **Encapsulate Collection**: Hide collection manipulation behind intention-revealing methods
- **Decompose Conditional**: Simplify if/else logic into named predicates
- **Pull Up/Push Down**: Reorganize shared logic in class hierarchies

## ✅ Do
- Always run tests before and after each refactoring
- Start with small refactorings (naming, method extraction) before large structural changes
- Improve code incrementally as part of feature or bug tasks
- Identify and eliminate code smells (duplication, long functions, switch statements)
- Make side effects explicit and isolate pure logic
- Prefer command-query separation when extracting logic
- Document major refactoring operations with clear commit messages

## 🚫 Don’t
- Don’t refactor without a passing test suite
- Don’t refactor and add features simultaneously — separate these commits
- Don’t rename variables without verifying every reference
- Don’t use refactoring to push large, unreviewable diffs — refactor in small pieces
- Don’t apply patterns blindly — refactor only when it improves clarity or design

## 📚 Codex Use Cases
Codex should apply this guide when:
- Cleaning up feature branches before PR submission
- Making legacy code testable (e.g., extract pure logic from side-effect-heavy classes)
- Migrating from procedural to object-oriented or service-oriented design
- Refactoring duplicated logic across layers (e.g., validation or formatting)
- Detecting code smells and suggesting targeted transformations
- Writing automated refactorings for common anti-patterns

> Source: *Refactoring: Improving the Design of Existing Code — Martin Fowler*
