TO DO Backend tasks
-------------------

# 📦 Codex Tasks – Refactor: Offline XLS PDF Generator

## 🧱 Epic: Offline XLS PDF Generator

📂 Location: `/docs/backend/flight/ingestion_filtering/parse_filter/`
📁 Layer: delivery → usecase → repository

---

### 🧩 Task 1: `xls_upload_ingestion`

**🎯 Objective:** Upload `.xls` file, validate schema, filter flights for J+1 or J+2

**Input:**

* `file`: Excel file stream (`.xls`)
* `mode`: `"commandes"` or `"precommandes"`
* `today`: optional override of base date

**Validation Rules:**

* File must be `.xls`-compatible and readable
* Required columns: `"Num Vol"`, `"Départ"`, `"Arrivée"`, `"Imma"`, `"SD LOC"`, `"SA LOC"`
* Normalize `SD LOC` and `SA LOC` with `today` as base

**Logic Flow:**

1. Load `.xls` and validate schema
2. Parse dates with error coercion
3. Filter by SD LOC date:

   * `commandes` → `today + 1`
   * `precommandes` → `today + 2`
4. Return filtered rows

**Output:** `List[FlightRow]`

**Tests:**

* Valid J+1 & J+2 files return correct row count
* Missing column returns 400
* Invalid date format handled gracefully

---

### 🧩 Task 2: `aircraft_class_capacity_rules`

**🎯 Objective:** Apply JC/YC max values based on aircraft immatriculation

**Input:** `FlightRow.imma`

**Rule Table:**

| Imma  | jc max | yc max |
| ----- | ------ | ------ |
| 5RMJF | 8      | 62     |
| 5REJC | 8      | 56     |
| 5REJH | 8      | 64     |
| 5REJK | 8      | 64     |
| 5REJB | 10     | 62     |

**Tests:**

* Row with `imma = 5REJC` has limits jc ≤ 8, yc ≤ 56

---

### 🧩 Task 3: `return_leg_class_boost`

**🎯 Objective:** Add JC/YC boost for return legs in `commandes` mode

**Input Conditions:**

* `mode == commandes`
* `arrivee == "TNR"`

**Rules:**

* If `depart` in {SVB, DIE, NOS} → `jc += 2`, `yc += 4`
* Else → `jc += 2`, `yc += 2`

**Tests:**

* Leg SVB → TNR in commandes returns jc = 2, yc = 4 (before clamping)
* Leg TLE → TNR returns jc = 2, yc = 2

---

### 🧩 Task 4: `jc_yc_capacity_clamping`

**🎯 Objective:** Ensure final `jc`/`yc` values do not exceed aircraft capacity

**Flow:**

* After return leg boost (if any), apply min(value, max\_capacity)

**Tests:**

* Row with `jc = 9`, `max_jc = 8` → output: `jc = 8`
* Same logic for `yc`

---

### 🧩 Task 5: `jc_yc_editable_ui_annotation`

**🎯 Objective:** Clarify that `jc`/`yc` values are editable only in frontend

**Docs Affected:**

* `TECH_SPEC.backend.md`
* `TECH_SPEC.frontend.md`

**Rules:**

* Output from `/process` is immutable
* UI edits must be local-only (non-persisted)

**Tests:**

* Not applicable (doc-only)

---

### 🧩 Task 6: `xls_format_correctness_test`

**🎯 Objective:** Ensure `.xls` not `.xlsx` used in tests

**Validation:**

* Unit and integration tests must:

  * Use `xlwt` or real `.xls` encoder
  * Avoid using openpyxl-generated `.xlsx` renamed to `.xls`

**Tests:**

* File created must be byte-validated for true `.xls`
