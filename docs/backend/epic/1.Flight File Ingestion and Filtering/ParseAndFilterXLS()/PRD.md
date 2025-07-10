Perfect — your folder structure is clear and follows clean modular separation. Let's now define the **PRD** and **TECH\_SPEC** for your **first feature**:

---

# 📘 PRD – Feature: `ParseAndFilterXLS()`

## 🧩 Belongs To

🧱 Epic: Flight File Ingestion and Filtering
📂 Module: `/backend/repository/xls_parser.py`

---

## 🎯 Goal

Create a reusable function that:

* Ingests a `.xls` file stream
* Parses and validates flight data columns
* Applies J+1 / J+2 date filtering based on mode
* Returns a normalized list of flight dictionaries for downstream use

---

## 👤 User Story

> *"As a developer or backend API consumer, I need a reusable function that takes in an uploaded `.xls` flight list, filters rows by operational date (J+1 or J+2), and provides structured data to generate command sheets."*

---

## 📥 Input

| Field   | Type            | Description                                              |
| ------- | --------------- | -------------------------------------------------------- |
| `file`  | stream          | In-memory file from FastAPI (`UploadFile.file`)          |
| `mode`  | string          | `"commandes"` or `"precommandes"`                        |
| `today` | `datetime.date` | Base date for filtering logic (injected for testability) |

---

## 📤 Output

A list of filtered flight rows as dictionaries:

```python
[
  {
    "num_vol": "AF1234",
    "depart": "CDG",
    "arrivee": "JFK",
    "imma": "F-HZUA",
    "sd_loc": datetime(2025, 7, 11, 10, 0),
    "sa_loc": datetime(2025, 7, 11, 13, 0)
  },
  ...
]
```

---

## ✅ Acceptance Criteria

* [x] File is read using Pandas without saving to disk
* [x] Raises clear exception if required columns are missing
* [x] Filters rows where `SD LOC.date()` matches:

  * J+1 (for `"commandes"`)
  * J+2 (for `"precommandes"`)
* [x] Dates normalized to Python `datetime` objects
* [x] Returns sanitized, structured list of dicts

---

## 🧪 Test Cases

| Scenario                          | Expectation                                 |
| --------------------------------- | ------------------------------------------- |
| Valid `.xls`, mode = commandes    | Rows with `SD LOC` = today + 1              |
| Valid `.xls`, mode = precommandes | Rows with `SD LOC` = today + 2              |
| File missing `Imma` column        | Raises `ValueError("Missing column: Imma")` |
| Non-date `SD LOC` field           | Skipped or handled gracefully               |

---
