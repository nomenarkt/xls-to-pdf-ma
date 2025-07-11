<!--

🛑 DO NOT EDIT THIS FILE.

This AGENT.md defines core Codex responsibilities and must remain stable.

Stack-specific variations belong in /tech-guides/{language}.md

-->

# AGENT.md – Codex Frontend Execution Guide

Welcome! This document defines how Codex contributes to our frontend codebase (React, Vue, Flutter, Svelte, Angular). All contributions must follow component-driven architecture, test-first development, and strict task alignment.

> 📘 For global Codex rules, see [`/AGENTS.md`](../AGENTS.md).
> 📚 For task specs, GPT roles, and architecture rules, see [`/ENGINEERING_GUIDE.md`](../ENGINEERING_GUIDE.md).
> 📐 For frontend architecture by stack, see [`/frontend/tech-guides/README.md`](./tech-guides/README.md)

---

## 👥 Project Structure & Roles

This monorepo is organized by platform responsibility:

```
/backend/             → Server logic (Architect-owned)
/frontend/web/        → Role-based web apps by stack: React, Vue, Svelte, Angular
/frontend/mobile/     → Role-based mobile apps: React Native (Expo), Flutter
/frontend/shared/     → Logic safe for both web and mobile (hooks, schemas, types, API)
```

* Codex writes logic based on tasks from The Polyglot (frontend) or The Architect (backend).
* Shared logic must remain platform-neutral and fully testable.
* NEVER invent features, flows, or props — Codex must always follow The Polyglot’s task spec exactly.

---

## 🧠 Codex Execution Rules

* Follow the spec. Never assume missing data.
* Enforce validation schemas, styling tokens, and code patterns.
* Keep logic portable, modular, and test-driven.

### 🔍 Preflight Verification Rule

Before implementing a task, Codex must check for existing code:

✅ Checklist:

* [ ] Look in `/web/`, `/mobile/`, `/shared/` for matching component, hook, or schema
* [ ] Confirm presence via test files
* [ ] If partial/legacy code exists, extend/refactor it — don’t duplicate

---

## 📖 Codex-Required Tech Guides

Codex MUST recursively scan all `.md` files inside the following directories:

* `/frontend/tech-guides/mobile/`
* `/frontend/tech-guides/shared/`
* `/frontend/tech-guides/web/`

This structure supports extensibility while enforcing consistent Codex behavior.

---

## 🧾 Task Tracker Enforcement Rule

All frontend Codex tasks must update `/codex_task_tracker.md` with:

* **Task Title**
* **Phase**
* **Layer(s)**: ui, state, hooks, api, routing
* **Status**: ✅ Done, ⏳ In Progress
* **Context**: frontend
* **Notes**
* **Created/Updated date**

➡ Use `/frontend/utils/taskLogger.ts` with `updateTaskTracker()` + `hasDuplicateTask()`.

Logging is **mandatory** for traceability and memory sync.

---

## 📊 Task Format from The Polyglot

Codex receives tasks in this format:

```
💻 Codex Task: [Component / Screen / Hook / Utility]
🧭 Context: frontend | shared
📁 Platform: web | mobile | shared | vue | angular | svelte
🎯 Objective: what the feature enables

🧩 Specs:

* Props / Inputs
* UI Design: Tailwind / Dripsy / native
* Behavior
* Validation: Zod / Yup
* Data: API hook / props / context
* Routing (if any)

🧪 Tests:

* Validate props and edge cases
* Simulate gestures
* Assert navigation or mutation

📦 Codex Must Follow:

* TDD-first implementation
* `tech-guides/*.md` rules
* `Zod`, `react-hook-form` where applicable

⛔ Codex Must NOT:

* Invent UI or flows
* Skip tests
* Fetch data in components
* Mix platform code into `/shared/`
```

---

## ✅ Commits & PRs

* One feature or fix per PR
* Use [Conventional Commits](https://www.conventionalcommits.org/):

  * `feat(web): add CheckoutBanner`
  * `fix(mobile): fix SafeArea padding bug`
* Keep commits atomic and tested

---

## 🧪 Testing Standards

Codex must use platform-native tools:

| Stack        | Tools                                         |
| ------------ | --------------------------------------------- |
| React        | `Jest`, `@testing-library/react`              |
| Vue          | `Vitest`, `vue/test-utils`                    |
| Svelte       | `svelte-testing-library`, `vitest`            |
| React Native | `@testing-library/react-native`, `jest`       |
| Flutter      | `flutter_test`, `mockito`, `integration_test` |

Tests must cover:

* Render outcomes
* Valid/invalid input
* Edge case logic
* API loading/mutation states

Place all test files beside their source (`*.test.ts`, `*_test.dart`, etc.)

---

## 🎨 Styling

* Use design tokens: `theme.ts`, `ThemeData`, or `nativewind.config.js`
* NEVER hardcode layout, spacing, colors, or fonts
* Enforce:

  * Dark mode compatibility
  * Accessibility: labels, contrast, touch targets
  * Safe areas on mobile

---

## 🧠 Shared Logic Standards

All `/shared/` code must be:

* Fully tested
* Platform-agnostic
* Type-safe
* Free of any direct imports from:

  * `next/*`
  * `react-native`
  * `flutter/*`
  * DOM APIs (`window`, `document`)

---

## 🚫 DO NOT

* Push speculative or unscoped logic
* Mix web/mobile logic in shared
* Write components without tests
* Hardcode strings or layouts

---

## ✅ YOU MUST

* Use validation schemas
* Follow `/tech-guides/*.md`
* Log to `/codex_task_tracker.md`
* Respect assigned platform boundaries
* Follow strict task execution with zero invention

---

This document is the **immutable Codex contract** for all frontend contributions.
