### 1. 💻 Codex Task: `ParseAndFilterXLS()`

🧭 Context: backend
📁 Layer: `usecase`
🎯 Objective:
Parse the uploaded `.xls` flight schedule and apply filtering rules based on selected `mode` (`J+1` or `J+2`) and `category` (`salon` or `prestations`).

🧹 Specs:

* **Input:** In-memory `.xls` file (already validated by `/process` handler)
* **Filtering Rules:**

  * Normalize timestamps (UTC, format ISO 8601)
  * Apply `J+1` or `J+2` filtering cutoff (based on flight departure)
  * Apply Salon-specific logic (e.g., `"Mvt"` presence)
  * Prestations: optionally pair flights for matching
* **Output:** JSON list of valid structured flight dicts

🥪 Tests:

* Valid `.xls` → returns expected rows
* Invalid timestamp → filtered out
* J+1 and J+2 filtering correctness
* Salon category applies Mvt filter
* Edge case: no matching rows

📦 Follow:

* Use `pandas`, no file I/O
* Must be testable by calling `parse_and_filter_xls(file: BytesIO, mode: str, category: str)`

-------------------------------------------------

### 2. 💻 Codex Task: `/process endpoint`

🧭 Context: backend | FastAPI
📁 Layer: `delivery`
🎯 Objective:
HTTP POST endpoint to upload `.xls`, choose mode/category, and return parsed flight rows from `ParseAndFilterXLS()`.

🧹 Specs:

* **Input:**

  * `file` (form-data `.xls`)
  * `mode`: `"precommandes"` or `"commandes"`
  * `category`: `"salon"` or `"prestations"`
* **Validation:**

  * File type is `.xls`
  * Columns contain required fields
* **Logic Flow:**

  * Validate + read file to memory
  * Pass to `usecase.ParseAndFilterXLS()`
  * Return JSON response
* **Response:**

  * `200 OK`: list of flight dicts
  * `400 Bad Request`: validation failure

🥪 Tests:

* Valid XLS → returns JSON
* Invalid file type → 400
* Missing field → 400
* J+1 vs J+2 correctness

📦 Follow:

* No JWT required
* Local-only mode (no persistent I/O)

---
