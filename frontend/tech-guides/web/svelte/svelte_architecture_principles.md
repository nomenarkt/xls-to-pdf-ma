# Real-World Svelte Architecture Principles

## 🔁 Core Principles
- Embrace **reactivity as a language primitive**—avoid unnecessary abstractions.
- Design apps with **small, composable components** and explicit state stores.
- Prefer **unidirectional data flow**, even with reactive variables.
- Keep logic colocated but separated—business logic in stores/composables, view logic in components.

## 🧩 Design Patterns
- **Component–Store Split**:
  - UI in `.svelte` components
  - State, logic, and services in `stores/` or `lib/`
- **Derived Stores and Context**:
  - Use `derived()` for computed values
  - Use `setContext/getContext` for cross-component communication
- **File-Based Routing** (SvelteKit):
  - One route = one folder with `+page.svelte`, `+layout.svelte`, `+page.ts`
- **Load Functions**:
  - Use `+page.ts` for server data loading
  - Prefer `load` for route-bound fetches over in-component asyncs

## ✅ Do
- Write small components with isolated responsibilities
- Use `$:` for reactive declarations and lifecycle side effects
- Extract logic to `stores`, `lib/`, and utility modules
- Use `svelte:head` for per-route metadata
- Prefer `const store = writable()` + `derived()` over unnecessary classes
- Use `onDestroy` for cleanup in long-lived components

## 🚫 Don’t
- Don’t overuse `$store` in templates—prefer readable/derived where possible
- Don’t mutate data directly in components—update via stores
- Don’t embed fetch or API logic in the `.svelte` files directly—prefer `load()`
- Don’t rely on magic context unless intentional—explicit `setContext` is better
- Don’t skip reactive cleanup—leaks happen without `onDestroy`

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding features inside `/routes/` using `+page.svelte`, `+page.ts`
- Creating reactive `stores/` with `writable()` or `derived()`
- Refactoring shared logic to `lib/` or `composables/`
- Ensuring data flows from `load()` → props → components cleanly
- Reviewing reactive declarations and component size boundaries
