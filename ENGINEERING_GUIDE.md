# SaaS Starter – GPT + Codex Collaboration

Welcome to your Codex-enabled, AI-driven SaaS starter template. This project is structured to deliver a **reliable**, **secure**, **scalable**, and **test-driven** system across frontend and backend, powered by custom GPTs and Codex.

## 🧠 GPT-Driven Engineering

This project is governed by:

* **The Architect (backend GPT)** – Oversees backend specs, tasks, testing rules, and architecture
* **The Polyglot (frontend GPT)** – Governs frontend specs, UI/UX flows, and design consistency
* **Codex** – Executes production-grade implementation with tests, based strictly on spec

## 🧩 Repository Structure

```
/backend                        → Clean Architecture backend stack
  /delivery                     → HTTP handlers (routes, request parsing)
  /usecase                      → Business logic (pure functions, orchestration)
  /repository                   → DB and external integrations
  /domain                       → Optional core types
  /internal
    /context                    → GPT state tools (e.g., task_logger.go)
    /infrastructure             → Shared config loaders (e.g., env.go)
  /tech-guides/                 → Language-specific runtime guides (e.g. golang.md)
  Telegram Mini Apps - Backend Guide.md → Platform-specific integration rules
  AGENT.md                      → Codex rules for backend
  backlog.md                    → Pending GPT tasks

/frontend                       → Component-driven frontend stack
  /web                          → Web UI (Next.js, Tailwind, etc.)
  /mobile                       → Mobile UI (React Native, etc.)
  /shared                       → Cross-platform logic (hooks, types, schemas)
  /tech-guides/                 → Platform-specific runtime guides (e.g. web.md, mobile.md)
  Telegram Mini Apps - Frontend Guide.md → Platform-specific WebApp integration
  AGENT.md                      → Codex rules for frontend
  backlog.md                    → Pending UI tasks

/.github/workflows/             → CI pipelines for linting, testing, docs

/codex_task_tracker.md          → Unified cross-stack task ledger (planned + completed)
/AGENT.md                       → Global Codex checklist and immutable pre-PR rules
/ENGINEERING_GUIDE.md          → System-wide Codex-GPT playbook, memory sync, task specs
```

## 🔁 Role Responsibilities

| File                    | Written By     | Read By    | Purpose                                                |
| ----------------------- | -------------- | ---------- | ------------------------------------------------------ |
| `codex_task_tracker.md` | **Codex**      | GPT, Codex | Master task matrix — planned and completed Codex tasks |
| `backlog.md`            | **You, Codex** | GPT, Codex | Queued features and upcoming Codex tasks               |
| `vision.md`             | **You, GPT**   | GPT, Codex | Strategic platform direction and constraints           |


---

## 🔧 Codex Logging Utilities

### Backend

* Location: `/backend/internal/context/task_logger.go`
* Functions:

  * `UpdateTaskTracker()` – If a task is found, sets its status to ✅ Done and adds metadata | If task is missing, appends a new row with auto-filled values
  * `hasDuplicateTask()` – Prevents duplicates
  * `CleanBacklog()` – Removes completed tasks from `backlog.md` by matching against `codex_task_tracker.md`

### Frontend

* Location: `/frontend/utils/taskLogger.ts`
* Functions:

  * `updateTaskTracker()` – Same behavior as backend, for codex_task_tracker.md
  * `hasDuplicateTask()` – Prevents re-logging
  * `cleanBacklog()` – Removes completed tasks from `backlog.md`
* All frontend Codex tasks must use `codex_task_tracker.md`


## 📓 Task Logging Rules

To ensure backlog cleanup tools (like `CleanBacklog()`) can track completion across split subtasks:
✅ When Codex splits a backlog task into subtasks, each row written to `codex_task_tracker.md` **must prefix its title with the original backlog task name**.

**Example:**
Backlog item:
- `Improve Forecast Coverage`

Subtasks in `codex_task_tracker.md`:
- `Improve Forecast Coverage – Add nil forecast test`
- `Improve Forecast Coverage – Log error case`

This allows tools to match `codex_task_tracker.md` entries with the backlog item and clean up once all subtasks are marked ✅ `Done`.
> Codex must enforce this prefixing convention whenever splitting a task into subtasks.


## 🚦 How to Start

### 1. 🔄 Sync Memory Between Sessions

* Every Codex-verified task must **update `codex_task_tracker.md`** using the logging utility.
* This applies to both completed tasks and newly discovered features.
* Always call `CleanBacklog()` after updating the tracker to remove fulfilled tasks from `backlog.md`.

---

## 🧪 Run Tests

### Backend

```bash
cd backend
make test
```

### Frontend

```bash
cd frontend/web
npm run test
```

Test rules:

* Coverage >90%
* Tests must exist for all inputs, UI states, and logic paths

---

## 🚀 Serve Locally

### Backend (Go)

```bash
cd backend/cmd/serve
ENV=development go run main.go
```

### Frontend (Next.js)

```bash
cd frontend/web
npm run dev
```

### Mobile (React Native)

```bash
cd frontend/mobile
npx expo start
```

---

## 🔐 Environment Loading Rule

**Backend:**

* Must use `LoadEnv()` from `/internal/infrastructure/env.go`

**Frontend:**

* Must use `getConfig()` from `/shared/config.ts` (typed and validated)

---

## ✅ CI/CD

* All commits must pass:

  * Formatters (`go fmt`, `eslint`, `prettier`)
  * Linters (`golangci-lint`, `eslint`)
  * Test coverage enforcement
* GitHub Actions automate validation

---

## 📦 Codex Task Spec (Always Followed)

Codex must implement all features by following the task specification format defined per stack:

### 🖥️ Backend – Clean Architecture

🗂️ File: `/backend/AGENT.md`

```
💻 Codex Task: [e.g., /refill endpoint, AuthMiddleware, StoreUser()]
🧭 Context: backend | shared
📁 Layer: [delivery | usecase | repository]
🎯 Objective:
[Briefly describe the system-level or user-facing goal.]
🧹 Specs:
- **Input:**  
  - JSON body, query params, or path  
  - Example: `{ userID: string, token: string }`
- **Validation Rules:**  
  - e.g., `quantity > 0`, `date must be ISO 8601`
- **Logic Flow:**  
  - Handler: validate input → extract user → call usecase  
  - Usecase: contain all business/domain logic  
  - Repository: database or API access only, no logic
- **Authorization:**  
  - Require JWT with: `userID`, `email`, `role`  
  - Restrict access to allowed roles: `[admin, pharmacist]`
- **Response:**  
  - `200 OK`: `{ status: "success" }`  
  - `400`, `401`, `403`, `500`: structured error object
🥪 Tests:
- Unit:
  - Success cases
  - Invalid input
  - Unauthorized access
  - Edge cases
- Integration:
  - Use appropriate tooling:
    - `httptest` (Go)
    - `httpx.AsyncClient` (Python)
    - `TestServer` (.NET)
    - `MockMvc` (Java)
    - `reqwest` or `tower` (Rust)
- Minimum test coverage: 90%
📦 Follow:
- Clean Architecture layering (`/delivery`, `/usecase`, `/repository`)
- Dependency Injection via interfaces
- No shared state, global mutable variables, or business logic in handlers
- Never bypass usecase → repository flow
- Obey constraints from:
  - `/backend/AGENT.md` (immutable core)
  - `/backend/tech-guides/{language}.md`
  - `/backend/tech-guides/backend.md` (shared rules)
⛔ Do NOT:
- Repeat logic across layers
- Leave untested or commented-out code
- Inject framework logic into business core
- Modify AGENT.md directly
```

---

### 🖼️ Frontend – Component + Platform Aware

🗂️ File: `/frontend/AGENT.md`

```
💻 Codex Task: [Component / Screen / Hook / Utility]
🧭 Context: frontend | shared
📁 Platform: [web | mobile | shared | vue | angular | svelte]
🎯 Objective: [What the feature does or enables]

🧩 Specs:
- Props / Inputs: [...]
- UI Design: [Tailwind / Dripsy / scoped CSS / native]
- Behavior: [...]
- Validation: [Zod/Yup schema]
- Data: [API hook / props / context]
- Routing (if any): [...]

🧪 Tests:
- Validate all props and edge cases
- Simulate interactions (click, tap, swipe)
- Confirm correct fetch/mutate/navigation

📦 **Codex Must Follow**:

* File and folder conventions
* TDD-first flow
* Zod + react-hook-form where applicable
* Platform-specific `tech-guides/*.md` and `/frontend/AGENT.md`

⛔ Codex Must NOT:

* Invent logic or behavior
* Skip tests or leave TODOs
* Call APIs directly in UI
* Mix platform code into `/shared/`
```

> ✅ Codex must follow platform-specific rules and never mix stack responsibilities.
> 📁 Task specs must appear at the top of each task file or pull request.

---

## 🧭 Strategic Alignment with Vision

Codex **must read** `/vision.md` and align implementation with platform goals. If logic or flow is ambiguous, pause and request GPT guidance.

---

This full-stack system ensures every UI interaction, backend operation, and architectural shift is clean, test-covered, and coordinated. You're now operating at top-tier engineering velocity.

