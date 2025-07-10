Excellent — your structure is clean and this Codex Task is ready to be defined as a discrete, testable delivery-level feature. Below is the full **PRD + TECH\_SPEC** for the `/process` endpoint logic based on your Codex definition.

---

# 📘 PRD – Feature: `/process` Endpoint Base Logic

## 🧩 Belongs To

🧱 Epic: Flight File Ingestion and Filtering
📁 Layer: `delivery → usecase → repository`
🔧 Feature: Upload `.xls`, select `mode` + `category`, return filtered rows

---

## 🎯 Goal

Expose a FastAPI endpoint that accepts a flight `.xls` file, filters its contents based on operational mode (`J+1` or `J+2`), and returns structured rows for downstream pairing or rendering.

---

## 👤 User Story

> *"As an airline staff user, when I upload a flight plan file and select mode/category, I want the backend to return just the relevant flights so I can preview or generate a command sheet."*

---

## 📥 Input

| Field    | Type   | Description                   |
| -------- | ------ | ----------------------------- |
| file     | `.xls` | Multi-day flight listing      |
| mode     | string | `commandes` or `precommandes` |
| category | string | `salon` or `prestations`      |

---

## 📤 Output

* HTTP `200 OK`

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

* HTTP `400 Bad Request` (invalid file, mode, or missing column)

---

## ✅ Acceptance Criteria

* [x] `.xls` is received as `multipart/form-data` and parsed in memory
* [x] Required columns are enforced
* [x] Mode logic correctly filters by J+1 or J+2
* [x] Returns structured flight list as JSON
* [x] Includes test cases for valid input, missing columns, wrong types

---