# 📄 TECH\_SPEC – Epic 1: Flight File Ingestion & Filtering

---

## 1. 📦 Tech Stack

| Component | Tool                          |
| --------- | ----------------------------- |
| API       | FastAPI                       |
| Parsing   | Pandas + xlrd                 |
| File I/O  | In-memory only (`UploadFile`) |

---

## 2. 📂 Folder Structure Impact

```bash
/backend/
├── delivery/
│   └── api_routes.py           # /process POST route
│
├── usecase/
│   └── process_flight_data.py  # core logic: filter + validate
│
├── repository/
│   └── xls_parser.py           # loads and validates Excel structure
```

---

## 3. 📤 API Endpoint

### `POST /process`

| Field    | Type      | Description                   |
| -------- | --------- | ----------------------------- |
| file     | form-data | Excel file                    |
| mode     | string    | `precommandes` or `commandes` |
| category | string    | `salon` or `prestations`      |

**Responses:**

* `200 OK`: JSON list of flights
* `400 Bad Request`: missing file, bad format, unsupported mode/category

---

## 4. ✈️ XLS Parsing Logic

### Required Columns

* `Num Vol`, `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`

### Date Filtering

```python
from datetime import date, timedelta

if mode == "commandes":
    target_date = today + timedelta(days=1)
elif mode == "precommandes":
    target_date = today + timedelta(days=2)
```

* Compare `SD LOC.date()` against `target_date`
* Normalize all `SD LOC` and `SA LOC` to `datetime` objects

---

## 5. 🔐 In-Memory Only

* Use FastAPI `UploadFile`
* Load file with `pd.read_excel(file.file)`
* No writes to disk

---

## 6. 🧪 Tests

| Layer       | Test                      | Expected Result               |
| ----------- | ------------------------- | ----------------------------- |
| Unit        | Missing columns           | Raises ValueError             |
| Unit        | Valid J+1 file            | Returns correct filtered rows |
| Integration | Upload with `httpx`       | Status 200 + list of rows     |
| Error       | Invalid `mode`/`category` | 400 Bad Request               |

---

## 7. 📦 Dependencies

* `pandas`
* `xlrd` (or `openpyxl` if converted to `.xlsx`)
* `fastapi`, `pydantic`, `uvicorn`

---

