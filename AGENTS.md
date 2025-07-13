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

## 🧠 SDLC Phases

```
Idea → Architecture → UX → Sprints → Specs → TDD → Deployment
```

All specs (PRD and TECH_SPEC) must be written before implementation. Use Codex standard for documentation lifecycle.

---

## 🧱 Codex Enforcement Protocols

* 🗂️ Track all tasks in `codex_task_tracker.md` with: Context, Task Title, Phase, Status, Layer, Domain, Module, Epic, Feature, Description, Test Status, Created, Updated
* 📄 Never modify AGENT.md from within Codex
* 🧾 Do not invent logic or routing — implement only what’s defined in `PRD.md` and `TECH_SPEC.md`
* 🧪 Include test specs with all Codex tasks (unit, integration, or E2E if applicable)

---

## 🛠 Commands (Generalized)

| Scope | Task                   | Description                                                           |
| ----- | ---------------------- | --------------------------------------------------------------------- |
| All   | **Format Code**        | Ensure all code is properly formatted using the language's formatter  |
| All   | **Run Linter**         | Run the linter for the specific language or platform                  |
| All   | **Run Tests**          | Execute all unit and integration tests                                |
| All   | **Ensure Green State** | All steps above must pass before creating or proposing a pull request |

> 📘 For system-wide engineering workflows, task specs, and architecture rules, see [`ENGINEERING_GUIDE.md`](./ENGINEERING_GUIDE.md).

> 💡 Refer to `/backend/tech-guides/languages/{language}.md`, `/frontend/tech-guides/web/{framework}.md`, or `/frontend/tech-guides/mobile/{framework}.md` to determine exact tools and conventions. Shared rules (Zod, testing, accessibility, forms) live in `/frontend/tech-guides/shared/{area}.md`.

---

## 📖 Codex-Required Tech Guides

Codex MUST recursively scan all `.md` files inside:

**Backend:**
- `/backend/tech-guides/api/`
- `/backend/tech-guides/architecture/`
- `/backend/tech-guides/coding/`
- `/backend/tech-guides/devops/`
- `/backend/tech-guides/domain/`
- `/backend/tech-guides/languages/`
- `/backend/tech-guides/security/`
- `/backend/tech-guides/serverless/`
- `/backend/tech-guides/storage/`
- `/backend/tech-guides/testing/`
- `/backend/tech-guides/backend_conventions.md`
- `/backend/tech-guides/README.md`

**Frontend:**
- `/frontend/tech-guides/web/`
- `/frontend/tech-guides/mobile/`
- `/frontend/tech-guides/shared/`
- `/frontend/tech-guides/frontend_conventions.md`
- `/frontend/tech-guides/README.md`

---

## 📁 Documentation Directory Rules

Use the following conventions for all specs:

**Backend:**

```
/docs/backend/<domain>/<module>/
├─ PRD.md
└─ TECH_SPEC.backend.md
```

**Frontend:**

```
/docs/frontend/<domain>/<module>/
└─ TECH_SPEC.frontend.md
```

> Only generate PRD.md for user-facing features. Never create placeholder specs. Use `/shared/` for API contracts.

---

## 🔁 Clean Architecture Layer Flow

**Backend:**
```
delivery → usecase → repository
```
* No logic in delivery or repository
* Respect dependency injection and error boundaries
* Use domain layer only if needed

**Frontend:**
```
Page → Controller → Hook/Store → Components → UI
```
* No business logic inside components
* Zod for validation
* Shared logic must live in `/shared/`
* Use Tailwind/Dripsy variants or tokens

---

## 🧭 Feature Specification Protocols

Before implementing any feature, Codex MUST:

**Backend:**

1. Read `/docs/backend/<domain>/<module>/PRD.md` (if user-facing)
2. Read `/docs/backend/<domain>/<module>/TECH_SPEC.backend.md`
3. Respect the Clean Architecture layer
4. Implement tests (unit + integration)

**Frontend:**

1. Read `/docs/frontend/<domain>/<module>/TECH_SPEC.frontend.md`
2. Trace: `screen → form → hook/service → API contract`
3. Match props, validation, behavior, loading, tests
4. Never assume UI or behavior — follow the spec

---

## 🔒 Codex Non-Negotiables

* Never bypass architecture layers
* Never invent business logic or UI behavior
* Never use shared mutable state
* Never edit AGENT.md, ENGINEERING_GUIDE.md, or other root governance docs
* Always enforce spec-based implementation
