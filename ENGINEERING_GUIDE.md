# ENGINEERING\_GUIDE.md – Codex + GPT System Guide

Welcome to your Codex-enabled, AI-driven SaaS engineering system. This guide defines how The Architect (backend GPT), The Polyglot (frontend GPT), and Codex collaborate through specs, tasks, and traceable implementation.

---

## 🧠 GPT-Driven Engineering

| Role          | Domain    | Responsibilities                                                            |
| ------------- | --------- | --------------------------------------------------------------------------- |
| The Architect | Backend   | Owns backend specs, layering, testing, and implementation guidance          |
| The Polyglot  | Frontend  | Owns component design, platform-specific rules, UI/UX specs                 |
| Codex         | Fullstack | Executes production-ready, test-covered implementations per scoped GPT task |

---

## 📁 Repository Overview

```
/backend                        → Clean Architecture backend stack
  /delivery                     → HTTP handlers (routes, request parsing)
  /usecase                      → Business logic (pure functions, orchestration)
  /repository                   → DB and external integrations
  /domain                       → Optional core types
  /internal
    /context                    → GPT state tools (e.g., task_logger.go)
    /infrastructure             → Shared config loaders (e.g., env.go)
  /tech-guides/                 → Language-specific and domain guides
  AGENT.md                      → Codex rules for backend
  backlog.md                    → Pending backend tasks

/frontend                       → Component-driven frontend stack
  /web                          → Web UI (Next.js, Tailwind, etc.)
  /mobile                       → Mobile UI (React Native, etc.)
  /shared                       → Shared hooks, types, schemas, forms
  /tech-guides/                 → Platform + design execution guides
  AGENT.md                      → Codex rules for frontend
  backlog.md                    → Pending UI tasks

/docs/                          → Functional + technical specs (epic + feature)
  /frontend/epic/{EPIC_NAME}/...
  /backend/epic/{EPIC_NAME}/...

/.github/workflows/             → Lint/test/CI pipelines
/codex_task_tracker.md          → Codex’s unified task ledger
/AGENTS.md                      → Global pre-PR & spec-routing rules
/ENGINEERING_GUIDE.md          → This file (GPT–Codex–User system doc)
```

---

## 🔁 Codex Memory and Task Sync

All GPT-generated tasks are tracked using:

* `backlog.md` (planned)
* `codex_task_tracker.md` (completed, in progress)

Codex must:

* Log each task outcome using the backend or frontend logger utility
* Match `task_tracker` entry titles with original backlog prefix
* Call `CleanBacklog()` to remove fulfilled backlog tasks

### 📍 Logger Utilities

**Backend:** `/backend/internal/context/task_logger.go`

* `UpdateTaskTracker()` – Upserts status and metadata
* `hasDuplicateTask()` – Prevents redundant entries
* `CleanBacklog()` – Prunes backlog

**Frontend:** `/frontend/utils/taskLogger.ts`

* `updateTaskTracker()` – Same behavior
* `hasDuplicateTask()`
* `cleanBacklog()`

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

* ✅ Code formatters
* ✅ Linters
* ✅ Unit + integration tests
* ✅ CI checks

Minimum test coverage: **90%**.

---

## 📦 Codex Task Format (Per Domain)

### 🔧 Backend

See `/backend/AGENT.md` for:

* Clean Architecture layering
* Mandatory test types
* API format and validation rules
* Role-based JWT handling
* Platform-specific conventions from `/tech-guides/languages/{language}.md`

### 🖼️ Frontend

See `/frontend/AGENT.md` for:

* Component/task specs
* Layering flow (UI → form/hook → API → schema)
* Zod + RHF + testing rules
* Design system enforcement (e.g., Tailwind, Dripsy)
* Runtime rules in `/tech-guides/{web|mobile|shared}/*`

---

## 📖 Feature Spec Source of Truth

All implementation MUST trace to specs under:

```
/docs/{frontend|backend}/epic/{EPIC_NAME}/{FEATURE}/[PRD.md, TECH_SPEC.md]
/docs/{frontend|backend}/epic/{EPIC_NAME}/[PRD.md, TECH_SPEC.md]
```

Use `/AGENTS.md` to route Codex behavior and `/functional_spec.md` to align strategic priorities.

---

## 🧭 Vision Alignment

Codex must consult `/functional_spec.md` for project goals. If a task is ambiguous or seems out of scope:

* ❗ Pause
* ✅ Ask Architect or Polyglot GPT for clarification
* 🛑 Never invent behavior, fields, or structure

---

This system enables full-stack AI software delivery with safety, quality, and clarity.
All contributions are scoped, test-first, and layered by design.
