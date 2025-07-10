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
```

---

## 🧪 Tests

### `tests/test_process_endpoint.py`

| Test                    | Description                              |
| ----------------------- | ---------------------------------------- |
| ✅ `POST /process` valid | Uploads `.xls`, mode = commandes         |
| ❌ Missing column        | Returns 400 with clear error             |
| ❌ Invalid mode          | Returns 400 – enum constraint            |
| ✅ Mode = precommandes   | Filters correctly for J+2                |
| ✅ Integration test      | File → Response validated in test client |

---

## 🔐 Authorization

* None (local offline app)
* Future scope: role validation (admin, op)

---

## 📦 Dependency Flow

```mermaid
graph TD
    A[FastAPI Route: /process] --> B[UseCase: process_flight_data()]
    B --> C[Repo: parse_and_filter_xls()]
    C -->|Pandas| D[.xls In-Memory Parsing]
    B --> E[Return filtered rows to route]
```

---

## 🧠 Implementation Sketch

### `api_routes.py`

```python
@router.post("/process")
async def process(
    file: UploadFile = File(...),
    mode: Literal["commandes", "precommandes"] = Form(...),
    category: Literal["salon", "prestations"] = Form(...)
):
    today = date.today()
    try:
        rows = process_flight_data(file.file, mode, today)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return rows
```

---

### `process_flight_data.py`

```python
def process_flight_data(file_stream: BinaryIO, mode: str, today: date) -> list[dict]:
    return parse_and_filter_xls(file_stream, mode, today)
```

---
