# Effective TypeScript Principles

## 🔁 Core Principles
- Prefer **type safety over runtime validation**
- Model your data and API contracts **explicitly and predictably**
- Use the **type system as documentation**
- **Limit type inference when clarity matters**

## 🧩 Design Patterns
- **Prefer `type` aliases for union/primitive contracts**, `interface` for object shapes
- **Guard function boundaries** with types on all parameters and return types
- **Use utility types (`Partial`, `Pick`, `Record`, etc.)** to derive new types
- **Isolate unsafe or `any` usage** behind type guards or wrappers
- **Model exhaustive cases** using `never` and `switch` validation

## ✅ Do
- Always type function params and return types (avoid `any`)
- Use `as const` to preserve literal values in objects and arrays
- Prefer `readonly` arrays and tuples for immutability guarantees
- Use `keyof typeof` and enums to model safe key sets
- Prefer generics over overloads when expressing flexible APIs
- Narrow types early using `in`, `typeof`, `instanceof`

## 🚫 Don’t
- Don’t export types that include `any` or `unknown` without guards
- Don’t use `object`, `Function`, or broad base types
- Don’t rely on inferred `any`—use `noImplicitAny` to enforce declarations
- Don’t cast (`as Type`) unless absolutely necessary—prefer guards
- Don’t mutate object shapes dynamically—model changes as transformations

## 📚 Codex Use Cases
Codex should use this when:
- Writing or reviewing shared `types.ts` and validation logic in `/shared/`
- Creating strongly typed API layers and response contracts
- Refactoring logic to reduce `any`, `unknown`, or unsafe type assertions
- Validating use of `as const`, `keyof`, `readonly`, and `Record<>`
- Generating types from schemas or OpenAPI contracts
