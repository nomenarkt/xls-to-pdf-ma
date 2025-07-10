
# 📄 TECH_SPEC.md  
**Backend – XLS-Based Flight Command Processor (Local PDF Web App)**

---

## 1. 📦 Tech Stack

| Layer       | Tech / Tool         | Purpose                              |
|-------------|---------------------|--------------------------------------|
| Framework   | FastAPI             | REST API server                      |
| Parsing     | Pandas + xlrd       | `.xls` ingestion and filtering       |
| PDF Engine  | ReportLab (or `fpdf2`) | Editable PDF rendering                |
| Runtime     | Python 3.11+        | Language/runtime                     |
| DevOps      | Docker              | Local containerized backend          |
| Testing     | `pytest`, `httpx`   | Unit and integration tests           |

---

## 2. 📂 Folder Structure

```bash
/backend/
├── AGENT.md
├── tech-guides/
│   └── python.md
├── delivery/
│   ├── api_routes.py           # FastAPI route handlers
│   └── request_models.py       # Pydantic schemas
├── usecase/
│   ├── process_flight_data.py  # J+1/J+2 filtering + dispatch
│   └── flight_pairing.py       # Outbound/return logic
├── repository/
│   ├── xls_parser.py           # XLS parsing and validation
│   └── pdf_generator.py        # Editable PDF logic (ReportLab/fpdf)
├── domain/
│   └── flight_entity.py        # Core Flight object/value types
├── tests/
│   ├── test_parser.py
│   ├── test_pdf_generator.py
│   └── test_process_logic.py
├── main.py                     # FastAPI entrypoint
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 3. 📤 API Endpoints

### `POST /process`
Process uploaded `.xls` with filters

- **Input**: `multipart/form-data`
  - `file`: `.xls`
  - `mode`: `"precommandes"` or `"commandes"`
  - `category`: `"salon"` or `"prestations"`
- **Output**: `application/pdf` (editable)

---

## 4. ✈️ XLS Parsing Logic

### Source: `.xls` file  
Expected columns:
- `Num Vol`, `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`

### Date Filtering Logic
```python
if mode == "pré-commandes":
    target_date = today + timedelta(days=2)
elif mode == "commandes définitives":
    target_date = today + timedelta(days=1)
```
- Filter `SD LOC` by `target_date.date()`
- Normalize all times and dates with timezone awareness

---

## 5. 🔁 Flight Pairing Logic (Prestations à Bord)

- Group by `Num Vol` and reverse route (Départ ↔ Arrivée)
- Match return flight by:
  - Same `Num Vol`, opposite direction
  - `SD LOC` > outbound `SA LOC`
  - Within 1 day range
- Omit `Date` and `Imma` from return row
- Each pair: one row outbound, one row return

---

## 6. 🍽️ Salon `Mvt` Rule

- Applies to Salon, outbound only
- From `SD LOC`:
  - `03:00` ≤ time < `09:30` → `BRUNCH`
  - Else → `LUNCH`

---

## 7. 🖨️ PDF Rendering (Editable Fields)

### Engine: ReportLab (or `fpdf2`)
- One PDF row per flight (or pair)
- All fields editable using AcroForm
- Match layout using Helvetica, fixed grid

---

## 8. 🔐 Local-Only & In-Memory Processing

- No disk storage
- `.xls` held in memory
- PDF returned via `StreamingResponse`
- Fully Dockerized

---

## 9. 🧪 Unit Testing Notes

### Tests

| Scope            | Tool     | Description                             |
|------------------|----------|-----------------------------------------|
| XLS Parser       | `pytest` | Validates required columns + date logic |
| Flight Pairing   | `pytest` | Grouping, ordering, and edge cases      |
| Mvt Logic        | `pytest` | Time-to-label transformation            |
| PDF Generator    | `pytest` | Output buffer contains editable fields  |
| API Integration  | `httpx`  | POST → Validate PDF byte response       |

---

## ✅ Compliance Checklist

- [x] Editable PDF matches layout
- [x] All fields editable
- [x] No disk writes
- [x] J+1/J+2 logic validated
- [x] Pairing accurate
- [x] Salon Mvt calculated
- [x] Local Dockerized mode
- [x] Unit test coverage
