# ENGINEERING_GUIDE.md – Codex + GPT System Guide

Welcome to your Codex-enabled, AI-driven SaaS engineering system. This guide defines how The Architect (backend GPT), The Polyglot (frontend GPT), and Codex collaborate through specs, tasks, and traceable implementation.

---

## 🧠 GPT-Driven Engineering

| Role          | Domain    | Responsibilities                                                            |
| ------------- | --------- | --------------------------------------------------------------------------- |
| The Architect | Backend   | Owns backend specs, layering, testing, and implementation guidance          |
| The Polyglot  | Frontend  | Owns UI architecture, task specs, platform rules, testing, and data flow    |
| Codex         | Fullstack | Executes production-grade, test-covered implementations per GPT spec        |

---

## 📁 Repository Overview

```
/backend
├── AGENT.md                     → Immutable Codex contract for backend
├── backlog.md                   → Pending backend tasks
├── delivery/                   → HTTP handlers (entrypoint layer)
├── usecase/                    → Pure business logic orchestration
├── repository/                 → DB or external API ports
├── domain/                     → Core types or entities (optional)
├── internal/context/           → Task logger and GPT state utilities
├── internal/infrastructure/    → Env/config/runtime utilities
├── tech-guides/                → Conventions per language or domain
├── tests/                      → Unit + integration test suites

/frontend
├── AGENT.md                     → Immutable Codex contract for frontend
├── backlog.md                   → Pending UI tasks
├── web/                         → Web UI (Next.js, Tailwind)
├── mobile/                      → Mobile UI (React Native, Dripsy)
├── shared/                      → Shared logic: hooks, schemas, forms
├── tech-guides/                 → Web/mobile/shared-specific guides

/docs/
├── backend/<domain>/<module>/  → [PRD.md, TECH_SPEC.backend.md]
├── frontend/<domain>/<module>/ → TECH_SPEC.frontend.md
├── functional_spec.md          → Strategic vision
├── shared/api-contracts.md     → API schemas + IO mapping

/codex_task_tracker.md          → Codex’s unified task ledger
/AGENTS.md                      → Global rules for Codex before PR
/ENGINEERING_GUIDE.md          → This file (system-wide collaboration doc)
/.github/workflows/             → Format, lint, test, CI/CD
```

---

## 🔁 Codex Memory and Task Sync

Codex must always:

* Update task entries in `codex_task_tracker.md`
* Match `Task Title` to original backlog
* Use `task_logger.go` or `taskLogger.ts` depending on domain
* Clear fulfilled tasks via `CleanBacklog()`

### 📍 Logger Utilities

**Backend:** `/backend/internal/context/task_logger.go`  
**Frontend:** `/frontend/utils/taskLogger.ts`

Functions:
- `updateTaskTracker()`
- `hasDuplicateTask()`
- `cleanBacklog()`

---

## ✅ Test & Lint Before All PRs

```bash
# Backend
cd backend && make test

# Frontend Web
cd frontend/web && npm run test

# Frontend Mobile
cd frontend/mobile && npx expo test
```

All commits must pass:

* ✅ Formatter
* ✅ Linter
* ✅ Unit & integration tests
* ✅ CI pipeline checks

> Minimum coverage: **90%**

---

## 📦 Codex Task Format

### 🔧 Backend Task Spec
💻 Codex Task: /generatePDF endpoint
🗭 Context: backend
📁 Layer: usecase
🎯 Objective: Generate PDF from filtered Excel data
🧱 Module: PDFExport, FlightLogs
📚 Epic: Report Generation
🧹 Feature: Download Filtered Flight Logs
🪹 Specs:
Input:

* rows: FlightRow\[]
* category: "salon" | "prestations"
  Validation:
* rows must be array
* category is required
  Flow:
* sanitize
* sort
* layout
* return file
  Response:
* 200 OK
* PDF (binary)

🥪 Tests:

* Valid input returns a PDF
* Missing input returns 400
* Edge case layouts render correctly

📀 Rules:

* Follow AGENT.md
* Respect backend\_conventions.md
* Include unit + integration tests
* Use interfaces + dependency injection
* Never bypass usecase → repository flow

⛔ Anti-patterns:

* No repeated logic
* No skipped validation
* No commented-out or untested code
* No AGENT.md modifications

See `/backend/AGENT.md` and `tech-guides/languages/{language}.md` for details.

### 🖼️ Frontend Task Spec
💻 Codex Task: \[Component / Screen / Hook / Utility]
🗬 Context: frontend | shared
📁 Platform: web | mobile | shared | vue | angular | svelte
🎯 Objective: What the feature does or enables
🧱 Module: \[e.g. BillingForm]
📦 Epic: \[e.g. Payments Infrastructure]
🔧 Feature: \[e.g. Checkout Flow]
🧲 Specs:

* Props / Inputs: \[...]
* UI Design: Tailwind / Dripsy / native / scoped CSS
* Behavior: \[...]
* Validation: Zod / Yup schema
* Data: API hook / props / context
* Routing: \[...] (if applicable)

🧪 Tests:

* Validate all props and edge cases
* Simulate interactions (click, tap, swipe)
* Confirm correct fetch/mutate/navigation

See `/frontend/AGENT.md` and `tech-guides/web|mobile|shared/*` for details.

---

## 📖 Feature Spec Source of Truth

All Codex tasks must trace to approved specs in:

```
/docs/backend/<domain>/<module>/PRD.md
/docs/backend/<domain>/<module>/TECH_SPEC.backend.md
/docs/frontend/<domain>/<module>/TECH_SPEC.frontend.md
```

Codex must never generate or implement unscoped features.

---

## 🧭 Vision Alignment

Codex and GPTs must consult:

* `/functional_spec.md` → Product goals
* `/AGENTS.md` → Global implementation rules
* `/codex_task_tracker.md` → Status and trace

Ambiguous or missing behavior?
→ Pause and ask the appropriate GPT (Architect or Polyglot).
→ Never assume logic, fields, or flows.

---

## 🧱 Docs Lifecycle Standard

| Phase        | Docs Required                                      |
| ------------ | -------------------------------------------------- |
| Before Code  | PRD.md, TECH_SPEC.md (frontend/backend)            |
| During Code  | API comments, OpenAPI stubs, unit test descriptions|
| After Code   | Changelog, README                                  |
| Persistent   | functional_spec.md, AGENT.md                    |

---

This is a zero-assumption engineering system.  
Everything is documented, spec-driven, layered, and enforced.
