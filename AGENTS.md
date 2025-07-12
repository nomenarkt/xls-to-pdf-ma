<!--
This file defines your rules across all modules.
Platform-specific variations belong in:
- /backend/tech-guides/languages/{language}.md
- /frontend/tech-guides/web/{framework}.md
- /frontend/tech-guides/mobile/{framework}.md
- /frontend/tech-guides/shared/{area}.md
-->

# AGENTS.md – Global Codex Guidelines

## ✅ Codex Pre-PR Checklist

Before opening a pull request, **you must**:

* ✅ Format all code
* ✅ Run linter
* ✅ Run unit tests
* ✅ Run integration tests (if applicable)
* ✅ Ensure all checks pass

You must never open a pull request unless all steps above succeed.

---

## 📘 Primary Execution Directives

Codex must begin all context resolution from:

* `/backend/AGENT.md` — defines backend layering, Clean Architecture, test structure, and repository conventions
* `/frontend/AGENT.md` — defines frontend UI boundaries, hook usage, test rules, and accessibility requirements

These AGENT.md files are the **primary entry points** for backend and frontend implementations, and override lower-level conventions when in conflict.

> In case of conflict between `AGENT.md`, `tech-guides/`, or `ENGINEERING_GUIDE.md`, Codex must pause and request clarification — never assume authority.

---

## 🛠 Commands (Generalized)

| Scope | Task                   | Description                                                           |
| ----- | ---------------------- | --------------------------------------------------------------------- |
| All   | **Format Code**        | Ensure all code is properly formatted using the language's formatter  |
| All   | **Run Linter**         | Run the linter for the specific language or platform                  |
| All   | **Run Tests**          | Execute all unit and integration tests                                |
| All   | **Ensure Green State** | All steps above must pass before creating or proposing a pull request |

> 📘 For system-wide engineering workflows, task specs, and architecture rules, see [`ENGINEERING_GUIDE.md`](./ENGINEERING_GUIDE.md).

> 💡 You must refer to `/backend/tech-guides/languages/{language}.md` or `/frontend/tech-guides/web/{framework}.md` or `/frontend/tech-guides/mobile/{framework}.md` to determine exact tools and conventions per domain. For shared rules (Zod, testing, accessibility), see `/frontend/tech-guides/shared/{area}.md`. A full index is provided in `/frontend/tech-guides/README.md` and `/backend/tech-guides/README.md`.

## 📖 Codex-Required Tech Guides

Codex MUST recursively scan all `.md` files inside the following directories:

**Backend:**

* `/backend/tech-guides/api/`
* `/backend/tech-guides/architecture/`
* `/backend/tech-guides/coding/`
* `/backend/tech-guides/devops/`
* `/backend/tech-guides/domain/`
* `/backend/tech-guides/languages/`
* `/backend/tech-guides/security/`
* `/backend/tech-guides/serverless/`
* `/backend/tech-guides/storage/`
* `/backend/tech-guides/testing/`

Codex must also read:

* `/backend/tech-guides/backend_conventions.md`
* `/backend/tech-guides/README.md`

**Frontend:**

* `/frontend/tech-guides/web/` (e.g. `react/`, `vue/`, `svelte/`, `angular/`, `nextjs/`)
* `/frontend/tech-guides/mobile/` (e.g. `flutter/`, `react-native/`)
* `/frontend/tech-guides/shared/` (e.g. `design/`, `typescript/`, `testing/`, `security/`, `performance/`, `fundamentals/`, `docs/`)

Codex must also read:

* `/frontend/tech-guides/frontend_conventions.md`
* `/frontend/tech-guides/README.md`

This structure enforces consistency while supporting extensibility.

## 📁 Feature Spec Index Protocol

All feature-level specifications must live under:

```
/docs/backend/epic/{EPIC_NAME}/{FEATURE}/[PRD.md, TECH_SPEC.md]
```

Each Epic must also include:

```
/docs/backend/epic/{EPIC_NAME}/PRD.md
/docs/backend/epic/{EPIC_NAME}/TECH_SPEC.md
```

> 🧭 Codex Rule:
> Before implementing any route, usecase, or repository logic, Codex MUST:
>
> * Read `/docs/backend/epic/{EPIC_NAME}/PRD.md`
> * Locate the feature under `{FEATURE}/PRD.md` and `TECH_SPEC.md`
> * Follow the Clean Architecture flow from `delivery → usecase → repository`
> * Match test expectations defined in the TECH\_SPEC.

---

📁 Feature Spec Index Protocol (Frontend)

All feature specifications for **frontend implementations** must reside under:

```
/docs/frontend/epic/{EPIC_NAME}/{FEATURE}/[PRD.md, TECH_SPEC.md]
```

Each Epic MUST also include global specs:

```
/docs/frontend/epic/{EPIC_NAME}/PRD.md
/docs/frontend/epic/{EPIC_NAME}/TECH_SPEC.md
```

## 🧭 Codex Rule:

Before Codex implements any:

* UI screen or component
* Hook, form, or API-bound logic
* Platform-specific integration (web, mobile)

Codex MUST:

1. **Read** the Epic-level PRD:
   `/docs/frontend/epic/{EPIC_NAME}/PRD.md`

2. **Locate and follow** the Feature-level specs:
   `/docs/frontend/epic/{EPIC_NAME}/{FEATURE}/[PRD.md, TECH_SPEC.md]`

3. **Trace the flow**:
   `screen → form → hook/service → API contract`

4. **Match**:

   * Props and validation from TECH\_SPEC
   * Loading/mutation/error behavior
   * Tests specified in TECH\_SPEC

5. **Do NOT invent** UI, behavior, or routing — only implement what is explicitly scoped in the specs.

## 🔁 Clean Layer Handoff

Codex must align implementation with the **frontend layering flow**:

```
Platform UI (web/mobile)
↓
Shared Hooks & Forms
↓
API Layer (in /shared/api/)
↓
Schema Validation (/shared/schemas/)
```

All layers must be fully tested, typed, and spec-compliant.
