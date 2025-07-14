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
A\[FastAPI Route: /process] --> B\[UseCase: process\_flight\_data()]
B --> C\[Repo: parse\_and\_filter\_xls()]
C --> D\[Pandas | .xls In-Memory Parsing]
D --> E\[Return filtered + reordered rows to frontend]

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

5. **Assign JC/YC Defaults by Aircraft**

   | Imma  | jc max | yc max |
   | ----- | ------ | ------ |
   | 5RMJF | 8      | 62     |
   | 5REJC | 8      | 56     |
   | 5REJH | 8      | 64     |
   | 5REJK | 8      | 64     |
   | 5REJB | 10     | 62     |

   * All rows must initialize `jc = 0`, `yc = 0`
   * Then, if mode = `commandes` and `arrivee == "TNR"`:

     * If `depart` in {SVB, DIE, NOS} → `jc += 2`, `yc += 4`
     * Else → `jc += 2`, `yc += 2`
   * After adjustment, `jc` and `yc` are **clamped to aircraft max capacity**

6. **Format Output Rows**

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
           jc=jc_value,
           yc=yc_value
       ))
   return result
   ```

---

## 🔒 PDF Output Constraint

* The generated PDF is **non-editable** (read-only):

  * JC/YC must be filled in the web UI prior to PDF generation
  * Final PDF reflects this immutable snapshot
  * UI edits are **local only** and must not mutate backend data

---

## 🧪 Test Coverage

### Unit

| Test                          | Input                         | Expected Result               |
| ----------------------------- | ----------------------------- | ----------------------------- |
| Valid .xls for `commandes`    | Raw file, mode = commandes    | Rows for J+1 returned         |
| Valid .xls for `precommandes` | Raw file, mode = precommandes | Rows for J+2 returned         |
| Missing column                | File missing `Imma`           | Raises ValueError             |
| Non-date `SD LOC`             | Malformed field               | Skipped or handled cleanly    |
| Out-of-range JC/YC UI edit    | JC > max, YC > max            | Clamped to aircraft limits    |
| Return leg boost              | Commandes, arrivee == TNR     | JC/YC incremented accordingly |

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

## ✅ Completion Summary: Offline XLS PDF Generator

### Tasks Completed

* [x] Remove undocumented category field from `/process`
* [x] Introduce FlightRow Pydantic model
* [x] Return typed FlightRow objects with jc/yc defaults
* [x] Apply return leg boosts in commandes mode
* [x] Clamp jc/yc values to aircraft limits
* [x] Clarify frontend jc/yc editing is UI-only, non-persistent
* [x] Add OpenAPI metadata to `/process` endpoint
* [x] Revise XLS parsing tests for true `.xls` files

### Validation

* 🔍 Test coverage confirmed with `pytest --cov`
* 📤 Endpoint outputs `List[FlightRow]` with correct schema
* 📂 Tests use `.xls` input with jc/yc logic enforced
* 🧾 OpenAPI metadata includes summary + description
