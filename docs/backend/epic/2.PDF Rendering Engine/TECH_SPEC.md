# 📄 TECH\_SPEC – Epic 2: PDF Rendering Engine

## 🎯 Objective

Generate editable PDF documents from filtered XLS flight data, formatted according to airline-specific layout templates for:

- Salon operations
- Prestations à Bord services

## 🧩 Functional Goals

- Editable PDF export per category (Salon / Prestations)
- Comply with visual and field layout of airline templates
- Support command modes: Pré-commandes (J+2) and Commandes Définitives (J+1)
- PDF must open/edit reliably in Acrobat/Foxit

## 📥 Inputs

- Filtered flight rows (`List[Dict]`)
- `mode`: `"precommandes"` or `"commandes"`
- `category`: `"salon"` or `"prestations"`

## 📤 Output

- Single `.pdf` binary file:
  - Editable text fields (e.g., Flight No, Gate, Pax)
  - Layout fidelity to expected airline template
  - Naming format: `category_j{1|2}_YYYY-MM-DD.pdf`

## 🔁 Logic Flow

### Salon

1. Process only outbound flights: `Départ == "TNR"`
2. For each row:
   - Parse `Heure Départ` field
   - If **03:00 < dep_time < 09:30** → `Mvt = "BRUNCH"`
   - Else → `Mvt = "LUNCH"`

### Prestations à Bord

1. Group by route (`Arrivée` + `Départ`) and timing proximity
2. Pair inbound and outbound flights
3. Output one row per pair in final PDF

## 🧪 Success Criteria

- Generated PDFs fully editable
- Mvt logic and flight pairing behave as expected
- Render completes in <3 seconds
- Layout matches provided sample PDFs

## ⚙️ Constraints

- Fully local (no cloud PDF APIs)
- French characters supported in fonts
- No layout deviations
- Works without persistent server

## 🔐 Security

- All PDF generation is done locally
- No sensitive personal data used
- No internet access required
```

---

## 🧠 `EPIC_TECH_SPEC.md` – PDF Rendering Engine

````md
# TECH_SPEC – Epic: PDF Rendering Engine

## 📦 Tech Stack

- Python 3.11+
- PDF engine: `reportlab`
- Font: DejaVu or Helvetica (French character support)
- Template assets (if needed): `/backend/templates/`

## 📂 Folder Structure

/backend/
├── delivery/pdf_handler.py              # Optional: POST /generate-pdf
├── usecase/generate_pdf.py              # Business logic layer
├── repository/pdf_renderer.py           # Low-level reportlab code
├── templates/                           # Optional PDF layout assets
└── tests/test_generate_pdf.py           # PDF regression + logic tests

## 📥 Input Schema

```python
class PDFRequest(BaseModel):
    flights: list[dict]
    mode: Literal["precommandes", "commandes"]
    category: Literal["salon", "prestations"]
````

## 🔁 Logic Flow

### Salon:

```python
for row in flights:
    if row["Départ"] != "TNR":
        continue
    dep_time = parse_time(row["Heure Départ"])
    if time(3, 0) < dep_time < time(9, 30):
        mvt = "BRUNCH"
    else:
        mvt = "LUNCH"
    render_row(row, mvt)
```

* Rows with missing time or invalid format are skipped.
* Times parsed to `datetime.time` safely.

### Prestations à Bord:

1. Flights are grouped and paired:

   * Inbound and outbound flights grouped by route code
   * Matching time window enforced (e.g., same day ± few hours)
2. Each pair becomes a row in the PDF
3. Editable fields: FlightNo, Pax, ServiceType, TrayCount, etc.

## 🖨️ PDF Output Format

* Engine: `reportlab.pdfgen.canvas`
* Editable fields via `canvas.acroform.textfield(...)`
* Layout:

  * Fixed coordinates per template
  * Field naming pattern standardized
* Output type:

  * `BytesIO()` or `save(filename)`

## 🧪 Unit Tests

* ✅ Generate PDF and assert output exists
* ✅ Mvt logic returns BRUNCH/LUNCH correctly
* ✅ Prestations flight pairing returns correct pairs
* ✅ Check field coordinates via regression test
* ✅ Open generated PDF and confirm editable fields

## ⛔ Rejections

* ❌ Do not include hardcoded filepaths
* ❌ Do not render PDFs without category check
* ❌ No cloud PDF libraries allowed (e.g., PDF.co, DocRaptor)

## ✅ CI/Linting

* `pytest` + `reportlab` installable via `requirements.txt`
* Include sample XLS input in `tests/assets/`

```
