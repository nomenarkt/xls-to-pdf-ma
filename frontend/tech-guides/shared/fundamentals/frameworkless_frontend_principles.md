# Frameworkless Front-End Engineering Principles

## 🔁 Core Principles
- The browser **is the framework**—understand the platform deeply before abstracting it.
- Control your **runtime dependencies**; minimize external abstractions.
- **Progressive enhancement** should guide feature design.
- Small, composable modules win over monolithic abstractions.
- Tooling is not a requirement for modern JS—**build only when you must**.

## 🧩 Design Patterns
- **Pure functions + DOM orchestration**: Keep business logic separate from DOM manipulation.
- **Event delegation**: Use parent-level listeners to simplify structure.
- **State-store as module**: Use closures or factory functions to isolate state logic.
- **Custom Events and Pub/Sub**: For decoupling UI components without frameworks.
- **Functional UI patterns**: `render(state)` functions that return DOM trees or strings.

## ✅ Do
- Use ES modules (`import/export`) for structure and reuse.
- Encapsulate UI logic as small DOM-bound components (`button`, `form`, etc.).
- Write testable logic **outside the DOM context**.
- Stick to **browser standards**: `fetch`, `CustomEvent`, `classList`, `dataset`, `FormData`.
- Prefer static assets over SPAs unless justified.
- Think in **imperative steps**, not reactive patterns.

## 🚫 Don’t
- Don’t reach for frameworks to solve basic routing, state, or templating needs.
- Don’t tightly couple data logic to event handlers.
- Don’t add unnecessary build steps—use native `type="module"` and dev servers.
- Don’t write unreadable abstractions in the name of “reusability”.
- Don’t allow one framework or tool to dictate your project’s architecture.

## 📚 Codex Use Cases
Codex should use this when:
- Building static-first pages without React/Vue (e.g., error screens, landing pages)
- Creating `public/`-based tools or scripts in monorepos (e.g., docs, diagnostics)
- Prototyping UI elements before framework decisions are made
- Writing testable DOM logic in plain JS
- Replacing over-complicated SPA logic with native form or link behaviors
