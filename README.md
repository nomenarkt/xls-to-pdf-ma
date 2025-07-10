# ✈️ Flight Command Sheet Generator

This local web app transforms raw `.xls` flight schedules into **fully editable PDF command sheets** for airline operations — covering both **Pré-commandes** (J+2) and **Commandes Définitives** (J+1), with modes for **Salon** and **Prestations à Bord**.

> Built for fast, secure, offline execution with high customization and extensibility.

---

## 📦 Features

- 🧾 Upload `.xls` flight schedules
- 📆 Auto-filter flights by J+1 or J+2 based on selected command type
- 🔄 Pair outbound/return flights (Prestations à Bord)
- 🍽️ Auto-fill movement type (Salon: BRUNCH or LUNCH)
- ✍️ Editable fields in final PDFs (not just J/C or Y/C — all fields!)
- 🖨️ PDF output that mirrors airline form templates
- 🔐 Fully offline/local use — no cloud dependency

---

## 📁 Modules

| Area       | Description                                  |
|------------|----------------------------------------------|
| `backend/` | FastAPI server, XLS parser, PDF generator    |
| `frontend/`| React app for XLS upload and table editing   |
| `docs/`    | Product + Technical documentation (PRD/Specs)|

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/flight-sheet-generator.git
cd flight-sheet-generator
```

### 2. Backend Setup (Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # installs FastAPI, pandas, xlrd, pytest and httpx
uvicorn main:app --reload
```

### 3. Frontend Setup (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

- Visit: `http://localhost:3000`

---

## 🛠 Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | React, Tailwind CSS      |
| Backend     | FastAPI, Pandas          |
| XLS Parsing | `openpyxl`               |
| PDF Engine  | `reportlab` or `pdfkit`  |

---

## 📄 Documentation

- [📘 PRD – Product Requirements](./docs/PRD.md)
- [🛠 TECH_SPEC: Backend](./docs/backend/TECH_SPEC.md)
- [🛠 TECH_SPEC: Frontend](./docs/frontend/TECH_SPEC.md)

These documents define all features, data models, filters, rules, and editable field policies for the generated PDFs.

---

## ✅ Sample Command Modes

| Mode                                 | Filter Flights On |
|--------------------------------------|-------------------|
| Pré-commandes – Salon                | Today + 2 (J+2)   |
| Pré-commandes – Prestations à Bord   | Today + 2 (J+2)   |
| Commandes Définitives – Salon        | Today + 1 (J+1)   |
| Commandes Définitives – Prestations  | Today + 1 (J+1)   |

> Example: If today is July 10 → Pré-commandes = July 12, Commandes Définitives = July 11

---

## 🧪 PDF Output Examples

- ✅ Fully editable
- ✅ Matched layout to airline PDF templates
- ✅ Supports outbound/inbound pairing
- ✅ Local time fields preserved

Reference examples:
- `Pré-commandes - Prestations à Bord.pdf`
- `Pré-commandes - Salon.pdf`

---

## 📦 Roadmap (Optional)

- [ ] Auto-detect directionality of flights
- [ ] Bulk override for input fields
- [ ] Export JSON before PDF
- [ ] Dark mode

---

## 👨‍✈️ Author

Created by [Nomena](https://github.com/nomenarkt) — built with Codex, Custom GPTs, and clean architecture.

---

## 🛑 Disclaimer

This tool is tailored for **airline ground ops** and **internal workflows**. It does **not** support commercial or multi-user deployment out of the box.
