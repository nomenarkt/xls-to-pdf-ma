## 🧭 Purpose

Airline ground teams today manage catering and cabin service planning using manual Excel sheets, printing, and inconsistently formatted files. This app fully automates flight filtering, movement pairing, and PDF command generation for **Prestations à Bord** and **Salon** operations — without requiring internet access.

## 👥 Target Audience

* Ground operations staff (catering, logistics coordinators)
* Agents working in offline/low-connectivity environments

## 🛠 Core Capabilities

* XLS flight schedule parsing (`.xls`, `.xlsx`)
* Automatic J+1 / J+2 filtering logic
* PDF command generation using ReportLab
* “Mvt” detection and pairing logic for Salons and Prestations
* Fully offline tool running in browser (no installation required)

## 💎 Differentiators

* 📴 **100% offline** — works in airport operations rooms without internet
* 🔁 **Custom flight-pairing and movement logic** built specifically for airline ops
* ⚙️ **No installation or backend server required** — runs via embedded browser
* 🎯 **Cleaner, faster, and simpler** than legacy ERP tools or Excel workarounds

## 🧱 MVP Scope

* XLS Upload UI in browser (React + Tailwind)
* Embedded backend (Pyodide or subprocess FastAPI) for XLS processing
* XLS parser with validation, filtering, pairing logic
* Editable PDF output with airline-specific layout and fields
* PDF download or in-browser preview
* Single-user local desktop usage

## ⚙️ IPC Strategy

* Runs as **ad hoc subprocess** backend:

  * Invoked from frontend (e.g., PyWebView, Electron shell, or browser subprocess)
  * FastAPI handles XLS uploads and parsing behind UI
* No persistent server — launched on demand

## 🧪 Success Criteria

* Agents generate valid, PDF commands in <5 minutes
* Zero manual editing needed after PDF export
* System validates XLS inputs and applies correct J+1/J+2/Mvt logic
* Works without internet, network drives, or authentication

## 🔒 Security & Trust Requirements

* Fully **offline-first** — no calls to external APIs, no telemetry
* All processing and data stay local on device
* No personal or sensitive passenger information handled
* Open-source libraries only; no cloud SDKs

---

## 🧠 System-Wide Architecture

The app is developed collaboratively by two GPT engineering agents:

* **The Architect (Backend)**:

  * Manages all parsing, filtering, pairing, and PDF logic
  * Enforces `/backend/` Clean Architecture structure
  * Writes specs and updates for: `repository → usecase → delivery`

* **The Polyglot (Frontend)**:

  * Manages React UI, XLS upload form, preview table, and user interactions
  * Communicates with backend via HTTP subprocess or WebAssembly (offline-safe)

All engineering tasks follow **spec-first delivery** backed by the shared Codex task governance.

### 🗂 Codex Task Flow

Task ownership is tracked in:

* 🧩 `/frontend/backlog.md` — UI, interaction, browser behavior
* 🧩 `/backend/backlog.md` — XLS parsing, business logic, PDF rendering
* ✅ `codex_task_tracker.md` — central tracker for:

  * Title, phase, status, layer
  * Spec linkage (PRD, TECH\_SPEC, etc.)
  * Timestamps and change history
  * Codex GPT instructions for reproducible logic

> Codex agents dynamically manage and update this tracker across all implementation phases.
