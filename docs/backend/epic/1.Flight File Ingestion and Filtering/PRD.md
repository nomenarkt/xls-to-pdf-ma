Here is the **full PRD and TECH\_SPEC** for **🧱 Epic 1: Flight File Ingestion & Filtering (Core XLS Parser)**, following our architecture standards.

---

# 📘 PRD – Epic 1: Flight File Ingestion & Filtering

## 🧱 Epic Title

**Flight File Ingestion & Filtering (Core XLS Parser)**

## 🎯 Goal

Enable the backend to parse uploaded `.xls` flight listings and filter them according to airline operational rules:

* Mode-based filtering (Commandes Définitives = J+1, Pré-commandes = J+2)
* Extract valid rows with all required columns
* Normalize data for downstream PDF generation

---

## 👤 Users

* Airline back-office staff using the web tool to generate command sheets
* Internal APIs or UI components requiring filtered flight data

---

## 📂 Input

| Field    | Type     | Description                       |
| -------- | -------- | --------------------------------- |
| file     | `.xls`   | Uploaded Excel file (flight list) |
| mode     | `string` | `precommandes` or `commandes`     |
| category | `string` | `salon` or `prestations`          |

---

## 📤 Output

A filtered list of structured flight rows:

```json
[
  {
    "num_vol": "AF1234",
    "depart": "CDG",
    "arrivee": "JFK",
    "imma": "F-HZUA",
    "sd_loc": "2025-07-11T10:00:00",
    "sa_loc": "2025-07-11T13:00:00"
  },
  ...
]
```

---

## ✅ Acceptance Criteria

* [x] Valid `.xls` is parsed without saving to disk
* [x] Required columns validated: `Num Vol`, `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`
* [x] Rows are filtered by `SD LOC` according to `mode` (J+1 or J+2)
* [x] API responds with structured, normalized JSON
* [x] Errors returned for bad file, missing columns, invalid mode/category

---

## 🚫 Out of Scope

* PDF generation
* Flight pairing (handled in Epic 2)
* `Mvt` logic or PDF layout

---