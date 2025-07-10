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
