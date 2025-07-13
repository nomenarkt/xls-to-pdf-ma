# 📄 TECH\_SPEC – Feature: `/process` Endpoint Logic

---

## 📁 Files Involved

```bash
/backend/
├── delivery/
│   └── api_routes.py           # FastAPI route handler
│
├── usecase/
│   └── process_flight_data.py  # Delegates to parser, applies mode logic
│
├── repository/
│   └── xls_parser.py           # `parse_and_filter_xls()`
├── domain/
│   └── models.py               # Pydantic model: FlightRow
```

---

## 🧠 Implementation Overview

graph TD
  A[FastAPI Route: /process] --> B[UseCase: process_flight_data()]
  B --> C[Repo: parse_and_filter_xls()]
  C --> D[Pandas | .xls In-Memory Parsing]
  D --> E[Return filtered + reordered rows to frontend]

---

## 🔍 Function Signature (Repository Layer)

```python
def parse_and_filter_xls(
    file_stream: BinaryIO,
    mode: Literal["commandes", "precommandes"],
    today: date
) -> list[FlightRow]:
    ...
```

---

## 🧾 OpenAPI / Swagger Annotations

### `domain/models.py`

```python
from pydantic import BaseModel
from datetime import datetime

class FlightRow(BaseModel):
    num_vol: str
    depart: str
    arrivee: str
    imma: str
    sd_loc: datetime
    sa_loc: datetime
    jc: int
    yc: int
```

### `api_routes.py`

```python
@router.post(
    "/process",
    response_model=list[FlightRow],
    summary="Filter and return structured flights",
    description="Parses XLS, filters by J+1 or J+2, returns formatted rows for pairing and layout."
)
async def process(
    file: UploadFile = File(...),
    mode: Literal["commandes", "precommandes"] = Form(...)
):
    today = date.today()
    try:
        rows = process_flight_data(file.file, mode, today)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return rows
```

---

## 🔎 Core Logic (UseCase + Repo)

1. **Load and Validate File**

   ```python
   df = pd.read_excel(file_stream)
   required = ["Num Vol", "Départ", "Arrivée", "Imma", "SD LOC", "SA LOC"]
   for col in required:
       if col not in df.columns:
           raise ValueError(f"Missing column: {col}")
   ```

2. **Parse and Normalize Dates**

   ```python
   df["SD LOC"] = pd.to_datetime(df["SD LOC"], errors="coerce")
   df["SA LOC"] = pd.to_datetime(df["SA LOC"], errors="coerce")
   ```

3. **Compute J+1 or J+2 Filtering Date**

   ```python
   target = today + timedelta(days=1 if mode == "commandes" else 2)
   filtered = df[df["SD LOC"].dt.date == target]
   ```

4. **Sort Flights by Logical Leg Order**

   * Group by flight number prefix or pairing logic (e.g., TNR → TLE then TLE → TNR)
   * Custom sort key applied based on SD LOC + departure logic

5. **Format Output Rows**

   ```python
   result = []
   for _, row in filtered.iterrows():
       result.append(FlightRow(
           num_vol=row["Num Vol"],
           depart=row["Départ"],
           arrivee=row["Arrivée"],
           imma=row["Imma"],
           sd_loc=row["SD LOC"],
           sa_loc=row["SA LOC"],
           jc=0,
           yc=0
       ))
   return result
   ```

---

## 🔒 PDF Output Constraint

* The generated PDF is **non-editable** (read-only):

  * JC/YC must be filled in the web UI prior to PDF generation.
  * Final PDF reflects this immutable snapshot.
* Output structure must pre-organize flights into **clean leg sequences** before layout rendering.

---

## 🧪 Test Coverage

### Unit

| Test                          | Input                         | Expected Result            |
| ----------------------------- | ----------------------------- | -------------------------- |
| Valid .xls for `commandes`    | Raw file, mode = commandes    | Rows for J+1 returned      |
| Valid .xls for `precommandes` | Raw file, mode = precommandes | Rows for J+2 returned      |
| Missing column                | File missing `Imma`           | Raises ValueError          |
| Non-date `SD LOC`             | Malformed field               | Skipped or handled cleanly |
| Out-of-range JC/YC            | Invalid values in UI          | PDF button disabled        |

### Integration

| Test                   | Description                                   |
| ---------------------- | --------------------------------------------- |
| Upload valid file      | `/process` returns structured rows + defaults |
| Upload bad format      | Returns 400                                   |
| JC/YC unfilled         | Prevents PDF generation                       |
| Disordered flight legs | Output reordered before rendering             |

---

## 🔐 Auth

* No authentication required (offline app)
* Future: role-based auth for operations/admin users

---

## 📦 Dependencies

* `fastapi`, `pydantic`, `uvicorn`
* `pandas`, `xlrd` or `openpyxl`
* `httpx`, `pytest`

---

### 💻 Codex Task: /process endpoint
📭 **Context:** backend
📁 **Layer:** usecase
🧱 **Module:** `parse_filter`, `ingestion_filtering`
📚 **Epic:** Flight Ingestion
🧹 **Feature:** Offline XLS PDF Generator
---
### 📐 Specs
**Input:**
* `file`: Excel file stream (`.xls`)
* `mode`: `"commandes"` | `"precommandes"`
* `today`: optional override for current date (default to now)
**Validation Rules:**
* File must be valid `.xls` and parsable
* Required columns: `"Num Vol"`, `"Départ"`, `"Arrivée"`, `"Imma"`, `"SD LOC"`, `"SA LOC"`
* `mode` must be either `"commandes"` or `"precommandes"`
* Dates must be normalized with `today` as base
* JC/YC columns must be valid (defaults to 0–99)
**Logic Flow:**
1. Parse uploaded Excel file into row structure
2. Normalize and clean up date fields
3. Apply filtering based on `mode`:
   * `"commandes"` → `today + 1`
   * `"precommandes"` → `today + 2`
4. Sort flights by `SD LOC` + logical order
5. Group flights into display pairs (TNR→TLE→TNR, etc.)
6. Return structured row list for UI and PDF generation
**Output:**
```json
[
  {
    "num_vol": "MD721",
    "depart": "TNR",
    "arrivee": "TLE",
    "imma": "5REJC",
    "sd_loc": "2025-07-11T04:10:00",
    "sa_loc": "2025-07-11T06:00:00",
    "jc": 0,
    "yc": 0
  },
  ...
]
```
---
### 📀 Tests
**✅ Unit Tests:**
| Scenario                | Expectation                         |
| ----------------------- | ----------------------------------- |
| Valid `.xls` with J+1   | Rows filtered and grouped correctly |
| Valid `.xls` with J+2   | Rows filtered and grouped correctly |
| Missing columns         | Raise `ValueError`                  |
| JC/YC out of range      | Skipped or marked invalid           |
| Upload malformed `.xls` | Raise fast failure                  |
| Incomplete rows         | Handled or excluded                 |
| Filtering mismatch      | Return empty list                   |
**✅ Integration Tests:**
| Scenario                 | Expectation                 |
| ------------------------ | --------------------------- |
| Upload + command mode    | Returns filtered JSON       |
| Upload + precommand mode | Returns filtered JSON       |
| Upload malformed file    | Returns 400                 |
| Upload invalid JC/YC     | PDF button disabled         |
| Out-of-range JC/YC       | Error state or empty result |
---
### 🔐 Auth:
* No auth required (offline tool for local ops)
* ⚠️ Future: Add role-based auth for command filtering
---
### 🧩 Dependencies:
* `pandas`, `pyxlsb`, or `openpyxl`
* `datetime`, `uvicorn`, `fastapi`
* Shared model: `FlightRow` (includes time parsing + grouping)
---
## ✅ Completion Summary: Offline XLS PDF Generator
### Tasks Completed
- [x] Remove undocumented category field from `/process`
- [x] Introduce FlightRow Pydantic model
- [x] Return typed FlightRow objects with jc/yc defaults
- [x] Add OpenAPI metadata to `/process` endpoint
- [x] Revise XLS parsing tests for true `.xls` files
### Validation
- 🔍 Test coverage confirmed with `pytest --cov`
- 📤 Endpoint outputs `List[FlightRow]` with correct schema
- 📂 Tests use `.xls` input with jc/yc defaults enforced
- 🧾 OpenAPI metadata includes summary + description

This completes the implementation of the **Offline XLS PDF Generator** feature per the documented specification.

