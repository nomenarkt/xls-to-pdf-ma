# Vision

## 🧭 Purpose

Airline ground teams currently rely on manual Excel sheets, printing, and inconsistent formats to prepare catering and cabin service orders. This app eliminates manual pairing, PDF formatting, and data entry for Prestations à Bord and Salon operations.

## 👥 Target Audience

* Ground operation staff (catering/logistics planners)
* Airline supervisors and dispatchers

## 🛠 Core Capabilities

* XLS flight schedule parsing
* J+1/J+2 automatic filtering
* Editable PDF command generation
* Mvt logic detection (BRUNCH/LUNCH)
* Offline-first, zero-dependency setup

## 💎 Differentiators

* Runs entirely offline — ideal for low-connectivity airports
* Fully editable PDF output — not just printable
* Custom logic for pairing flights and calculating service movement
* Simpler than catering ERP systems and better than generic PDF tools

## 🧱 MVP Scope

* XLS Upload UI
* Backend parsing + grouping logic
* Editable PDF rendering (ReportLab or PDFkit)
* React + Tailwind UI with 2 command modes
* No auth, single-user desktop usage

## 🧪 Success Criteria

* Ground agents export editable PDFs in <5 min
* 100% fidelity to airline layout expectations
* No need to edit files manually after generation

## 🔒 Security & Trust Requirements

* Fully offline and local
* No personal or sensitive data stored
* No cloud dependencies

---

## 🧠 System-Wide Architecture

This app is built with two expert GPT agents:

* **Backend Architect**: manages XLS logic, filtering, pairing, PDF rendering
* **Frontend Architect**: manages XLS upload, table display, form input, API wiring

All features follow a Clean Architecture approach, driven by spec-first planning with Codex support.

### 🔁 Task Flow

* Frontend tasks: `/frontend/backlog.md` and `/frontend/task_log.md`
* Backend tasks: `/backend/backlog.md` and `/backend/task_log.md`
