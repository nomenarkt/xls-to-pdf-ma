# Modern Angular Architecture Guidelines

## 🔁 Core Principles
- Embrace **standalone components** and **signals** for modularity and clarity.
- Angular apps should favor **declarative, reactive patterns** over imperative code.
- Prefer **cohesive feature modules** over monolithic shared modules.
- Make SSR, hydration, and preloading **first-class citizens** in your design.
- Keep templates clean—logic belongs in the component class or services.

## 🧩 Design Patterns
- **Feature-first folder structure**: `/features/[feature]/[components|services|guards]`
- **Standalone Components**:
  - No need for `NgModule`
  - Direct `imports` inside `@Component`
- **Signals and Effects**:
  - `signal()` for local state
  - `computed()` for derived state
  - `effect()` for subscriptions
- **Dependency Injection Zones**:
  - Use `providedIn: 'root'` for global services
  - Limit shared state using `inject()` in component-only scope
- **Router with Standalone Components**:
  - Define routes inline with lazy-loaded `loadComponent`

## ✅ Do
- Use `@Component({ standalone: true })` by default in new components.
- Prefer `inject()` over constructor injection for composables/utilities.
- Manage reactive state via signals instead of RxJS when possible.
- Keep selectors, guards, resolvers colocated with the feature.
- Optimize bundles using built-in **code-splitting** and **preloading** strategies.
- Use Angular’s `@Input` and `@Output` only for explicit component contracts.

## 🚫 Don’t
- Don’t overuse shared modules—prefer direct imports or common libraries.
- Don’t nest business logic in templates.
- Don’t wrap everything in `NgModules`—they are optional in modern Angular.
- Don’t use services as dumping grounds for unrelated logic.
- Don’t manually unsubscribe from effects—prefer `effect()` and `takeUntilDestroyed()`.

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding new Angular apps or features using standalone components
- Refactoring legacy modules into modern, modular standalone units
- Designing UI logic with signals for local state
- Writing services with `inject()` and local-only providers
- Implementing route-level lazy loading via `loadComponent`
- Writing composable utilities or DI-injected hooks
