# 📘 PRD – Feature: FlightRow Structure Documentation

## 🧩 Belongs To

🧱 Epic: Flight File Ingestion & Filtering
📂 Module: `/frontend/shared/types/flight.ts`

---

## 🎯 Goal

Provide a reference for developers explaining how the `FlightRow` type maps to columns in the editable table. Clarify which fields are editable and how new columns should be added in future iterations.

---

## 👤 Users

- Internal developers working on the editor UI.

---

## 📥 Source

`FlightRow` is defined in `/frontend/shared/types/flight.ts` and returned by the backend `/process` endpoint.

---

## 📝 Documentation Outline

1. Field list with editable vs read‑only status.
2. Mapping of each field to table column heading.
3. Guidance on extending the interface when backend returns extra columns.

### Editable Fields

- `depart`
- `arrivee`
- `imma`
- `sd_loc`
- `sa_loc`
- `j_class`
- `y_class`

---

## ✅ Acceptance Criteria

- [ ] Documented mapping matches current interface.
- [ ] Instructions cover future extension without breaking the table.
- [ ] Inputs for `j_class` and `y_class` appear and default to `0`
- [ ] Inputs propagate changes to `FlightRow` state
