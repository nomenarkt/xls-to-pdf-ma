# /tech-guides/shared.md – Shared Logic Guide

This guide defines rules for `/frontend/shared/`, which hosts UI-safe logic reused across web and mobile platforms. It ensures platform-agnostic patterns, strict validation, and testable utilities/hooks that power consistent cross-stack user experiences.

## 👥 Ownership

* `/shared/` is owned by The Polyglot (Frontend Architect)
* Supports all frameworks:

  * Web: React, Vue, Svelte, Angular
  * Mobile: React Native, Flutter
* 🚫 Never import platform-specific modules (`next/router`, `react-native`, `document`, etc.)

---

## 📦 Folder Conventions

* `/shared/api/` – API fetchers, service wrappers
* `/shared/hooks/` – platform-neutral hooks/composables
* `/shared/schemas/` – validation schemas (Zod, Yup, JSON schema)
* `/shared/types/` – TypeScript types or Dart interfaces for cross-platform use
* `/shared/utils/` – pure functions (date formatting, ID generation, etc.)

---

## 📡 API Access

* Wrap raw fetch/axios/http in `/shared/api/`
* Prefer typed wrappers per stack:

  * React/Vue/Svelte: React Query/Vue Query/Svelte Query hooks
  * Angular: injectable `HttpService` layer
  * Flutter: service classes with `http` or `dio`
* Return shape: `{ error: string, code?: number }`
* Hooks must expose loading, error, success states internally

---

## ✅ Validation

* Use Zod (preferred), Yup, or JSON schema
* Always define input/output separately: `createXSchema`, `xResponseSchema`
* Reuse these in forms, hooks, services, and guards

---

## 🧠 Shared Hooks

* Must avoid DOM or platform bindings
* Use generic inputs and outputs
* Examples:

  * `useCurrentUser()` → return parsed API data
  * `useDeviceType()` → abstracted screen size handling
* Covered with unit tests using appropriate stack tools (Jest, Vitest, etc.)

---

## 🧪 Testing

* 100% unit test coverage required
* Co-locate tests: `logic.ts → logic.test.ts`
* Validate all states: loading, success, error, fallback
* Use mocks (e.g., MSW, mockito) to isolate API

---

## 🔒 Safe Imports

✅ Allowed:

* `react`, `zod`, `axios`, `clsx`, `date-fns`, `@tanstack/query-core`
* `vue-demi`, `svelte/store`, Angular `injectable` (for composables)

🚫 Forbidden:

* `next/*`, `react-native`, `flutter/*`, `document`, `window`, DOM APIs

---

## 🧩 Example (React/Vue Compatible)

```ts
// /shared/hooks/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/user';
import { userResponseSchema } from '../schemas/user';

export const useCurrentUser = () => {
  return useQuery(['currentUser'], async () => {
    const data = await getCurrentUser();
    return userResponseSchema.parse(data);
  });
};
```

---

## 🧭 Link to AGENT & ARCHITECT Contracts

* Extends rules from [`/frontend/AGENT.md`](../frontend/AGENT.md)
* Aligns with architecture in [`/frontend/ARCHITECT.md`](../frontend/ARCHITECT.md)

✅ Never skip validation or tests.
✅ All logic must be portable, typed, and production-safe.

