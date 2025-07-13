# 📘 TECH\_SPEC – Feature: Generate Final PDF

## 🧹 Belongs To

* 🧱 Epic: Offline XLS PDF Generator
* 📂 Domain: `pdf`
* 📁 Module: `rendering`
* 🔧 Feature: `generate_pdf`

---

## 🧱 Tech Stack

| Component  | Tool              |
| ---------- | ----------------- |
| Framework  | FastAPI           |
| PDF Engine | ReportLab or FPDF |
| Schema     | Pydantic          |
| Transport  | StreamingResponse |

---

## 📂 Folder Structure Impact

```bash
/backend/
├── delivery/
│   └── pdf_routes.py              # /generatePDF route
├── usecase/
│   └── generate_pdf_service.py    # generate_pdf(flights, mode)
├── schemas/
│   └── pdf_models.py              # FlightRow, GeneratePdfPayload
```

---

## 📤 API Endpoint – Swagger/OpenAPI Stub

```yaml
POST /generatePDF:
  summary: Generate finalized PDF of flights
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            flights:
              type: array
              items:
                $ref: '#/components/schemas/FlightRow'
            mode:
              type: string
              enum: [commandes, precommandes]
  responses:
    '200':
      description: Binary PDF file
      content:
        application/pdf:
          schema:
            type: string
            format: binary
```

---

## 🧾 Pydantic Schemas

```python
class FlightRow(BaseModel):
    num_vol: str
    depart: str
    arrivee: str
    imma: str
    sd_loc: datetime
    sa_loc: datetime
    jc: int
    yc: int

class GeneratePdfPayload(BaseModel):
    flights: list[FlightRow]
    mode: Literal["commandes", "precommandes"]
```

---

## 🚏 Endpoint Stub (FastAPI)

```python
@router.post("/generatePDF")
async def generate_pdf_endpoint(payload: GeneratePdfPayload):
    if not validate_rows(payload.flights):
        raise HTTPException(status_code=400, detail="Invalid JC/YC values")
    pdf_bytes = generate_pdf(payload.flights, payload.mode)
    filename = format_filename(payload.mode)
    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf", headers={
        "Content-Disposition": f'attachment; filename="{filename}"'
    })
```

---

## 🧪 Unit & Integration Tests

| Test Type   | Scenario                      | Expected Result                       |
| ----------- | ----------------------------- | ------------------------------------- |
| Unit        | Missing JC or YC              | Reject with validation error          |
| Unit        | Invalid JC/YC (out of 0–99)   | 400 Bad Request                       |
| Unit        | Flight leg pairing sorting    | Output follows operational order      |
| Integration | Valid payload posted          | 200 + PDF streamed back               |
| Integration | Mode = commandes with data    | File = Commandes\_définitives\_\*.pdf |
| Integration | Mode = precommandes with data | File = Pré-commandes\_\*.pdf          |

---

## 🚫 Constraints

* Output PDF must not be editable
* PDF must be printable and formatted A4 landscape
* J/C and Y/C fields are required and must be validated before backend call
* Flight rows must be properly grouped by pairings (outbound/inbound)

---

## 📦 Dependencies

* `fastapi`, `pydantic`, `uvicorn`
* `fpdf` or `reportlab`

---

## 📎 Notes

* PDF rendering engine should be testable independently of web layer
* Use dependency injection for PDF generator engine to facilitate test coverage
* No temporary disk writes (use in-memory streaming)
* PDF must preserve order and leg pairing logic provided by filtered flight list

