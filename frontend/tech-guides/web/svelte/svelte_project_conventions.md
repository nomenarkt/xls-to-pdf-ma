# /tech-guides/svelte.md – SvelteKit Tech Guide

This guide defines SvelteKit-specific conventions for frontend web development. It supports SSR/SPA patterns and aligns with Codex task execution per `/frontend/ARCHITECT.md`.

---

## ✅ Framework

* SvelteKit with file-based routing
* Hybrid SSR/SPA with server endpoints
* `.svelte` components using `<script lang="ts">`

---

## 🧭 File Structure

```
/frontend/svelte/
├── routes/           # Pages with server/client logic
├── lib/
│   ├── components/   # Reusable UI
│   ├── stores/       # Writable/readable stores
│   ├── hooks/        # Shared logic
│   └── utils/        # Pure helpers
```

* Group routes and components by feature domain

---

## 🎨 Styling

* Tailwind CSS with `/shared/theme.ts` tokens
* Style within `<style>` blocks scoped to components
* Ensure dark mode and accessibility support

---

## 🧠 State Management

* Use Svelte writable/readable stores
* For async state, combine with `load()` and `onMount`
* No context API for app-wide state; use `/shared/`

---

## 🧾 Forms & Validation

* Use `felte`, `svelte-forms-lib`, or native bindings
* Validate with Zod (preferred) or Yup from `/shared/schemas/`
* Use actions for field-level interop

---

## 🔌 API Integration

* Prefer `+server.ts` endpoints or `/shared/api/`
* Call APIs via load functions or custom composables
* Handle `loading`, `error`, `data` states in templates

---

## 🧪 Testing

* Use `@testing-library/svelte` with Vitest
* Place tests beside logic: `Component.svelte` → `Component.test.ts`
* Cover rendering, event dispatching, data loading
* Min 90% coverage

---

## 🪄 Tooling

* ESLint, Prettier
* TypeScript with strict mode
* Vitest + Svelte Testing Library
* Tailwind via PostCSS

---

## 📚 Reference Books

* *Frontend Architecture for Design Systems* – Micah Godbolt
* *Frameworkless Front-End Development* – Francesco Strazzullo
* *Effective TypeScript* – Dan Vanderkam

---

Refer to [`/frontend/AGENT.md`](../AGENT.md) and [`/frontend/ARCHITECT.md`](../ARCHITECT.md) for execution rules and task specs.

