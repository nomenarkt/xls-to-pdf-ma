# /tech-guides/vue.md – Vue 3 + Vite/Nuxt Tech Guide

This guide defines Vue-specific conventions for frontend web projects using Vue 3 and Vite or Nuxt. It aligns with the Codex execution model and supports task assignment from `/frontend/ARCHITECT.md`.

---

## ✅ Framework

* Vue 3 with Composition API
* Vite (SPA) or Nuxt (SSR/SSG)
* Single-file components (`.vue`) with `<script setup>`

---

## 🧭 File Structure

```
/frontend/vue/
├── components/       # Reusable UI components
├── composables/      # Custom hooks
├── pages/            # Page-level views (Nuxt)
└── stores/           # Pinia state modules
```

* Use folder-per-feature layout
* Organize by domain (e.g., `/orders/`, `/users/`)

---

## 🎨 Styling

* Tailwind CSS with tokens from `/shared/theme.ts`
* Scoped styles in SFCs
* Use `aria-*`, `role`, and semantic elements for a11y

---

## 🧠 State Management

* Use Pinia for global state
* Use `ref`, `reactive`, and `computed` from Vue core
* Composables (`useXyz`) live in `/composables/`

---

## 🧾 Forms & Validation

* Use `vee-validate` or `vue-hook-form` with Zod or Yup
* Schemas imported from `/shared/schemas/`
* Bind field state via `v-model`

---

## 🔌 API Integration

* Use composables like `useGetUsers`, `useCreateOrder`
* All API logic wrapped in `/shared/api/`
* Prefer Vue Query for remote data caching
* Handle all fetch states (loading, error, success)

---

## 🧪 Testing

* Use `@vue/test-utils` with Vitest
* Co-locate tests: `Component.vue` → `Component.test.ts`
* Minimum 90% coverage
* Test rendering, input binding, emits, async fetch

---

## 🪄 Tooling

* ESLint + Prettier
* TypeScript with strict mode
* Use `<script setup lang="ts">`
* Lint rules extend from Vue 3 recommended presets

---

## 📚 Reference Books

* *Vue.js 3 By Example* – John Au-Yeung
* *Effective TypeScript* – Dan Vanderkam
* *Frontend Architecture for Design Systems* – Micah Godbolt

---

See [`/frontend/AGENT.md`](../AGENT.md) for Codex execution rules.
See [`/frontend/ARCHITECT.md`](../ARCHITECT.md) for task specs.

