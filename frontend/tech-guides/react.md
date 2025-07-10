# /tech-guides/react.md – React + Next.js Tech Guide

This guide defines implementation best practices for all React-based web UIs, including those built with Next.js (App Router). It provides Codex with stack-specific conventions and complements the `/frontend/AGENT.md` and `/frontend/ARCHITECT.md` contracts.

---

## ✅ Framework

* React 18+
* Next.js (App Router only)
* Server Components with "use client" boundary for interactivity

---

## 🧭 File Structure

```
/web/
├── app/              # App Router structure (admin, user, auditor)
├── components/       # Shared component library
└── pages/            # Static content (optional)
```

* All code lives under `/frontend/web/`
* Use RSCs by default, mark interactive components with `"use client"`

---

## 🎨 Styling

* Tailwind CSS with design tokens
* Tokens defined in `/shared/theme.ts`
* Never hardcode spacing, colors, or fonts
* Use semantic HTML and ARIA attributes

---

## 🧠 State Management

* Use React Query for server state
* Local state via `useState` or `useReducer`
* Context allowed for scoped session state
* Avoid global stores (e.g., Redux) unless scoped and justified

---

## 🧾 Forms & Validation

* Use `react-hook-form`
* Validation via Zod schemas from `/shared/schemas/`
* Show inline validation and async/server errors
* Mark required fields, use accessible labels

---

## 🔌 API Integration

* Never call fetch/axios directly in UI components
* Wrap API logic in `/shared/api/` and expose via typed hooks from `/shared/hooks/`
* Use query/mutation naming: `useCreateUser`, `useListOrders`, etc.
* Handle loading, error, and success states

---

## 🧪 Testing

* Use React Testing Library (RTL)
* Write tests for:

  * Rendering props and variants
  * Click, type, submit interactions
  * Query/mutation effects
  * Accessibility (focus, labels, roles)
* Minimum 90% coverage enforced by CI
* Test files co-located: `ComponentName.tsx` → `ComponentName.test.tsx`

---

## 🪄 Tooling

* TypeScript strict mode enabled
* ESLint with `eslint-plugin-jsx-a11y`
* Prettier auto-formatting
* `theme.ts` for token enforcement

---

## 📚 Reference Books

* *Real-World Next.js* – Michele Riva
* *Effective TypeScript* – Dan Vanderkam
* *Fullstack React with TypeScript* – Nate Murray
* *Modern Redux* – Ohans E
* *Mastering TDD with React* – Gupta & team

---

For architecture flow and task templates, refer to [`/frontend/ARCHITECT.md`](../ARCHITECT.md).
For Codex implementation boundaries, see [`/frontend/AGENT.md`](../AGENT.md).

