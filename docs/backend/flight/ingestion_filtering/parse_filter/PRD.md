# 📘 Product Requirements Document (PRD)

## 🧱 Epic: Offline XLS PDF Generator

🔧 **Feature**: Upload `.xls` → Select mode → View filtered editable rows → Download PDF
📂 **Location**: `/docs/backend/flight/ingestion_filtering/parse_filter/`
📁 **Layer**: `delivery → usecase → repository`

---

## 👤 User Stories

> *"As an airline staff user, when I launch the app, I want to upload a raw `.xls` file and then select either 'Commandes Définitives' or 'Pré-commandes', so that I can view and edit a filtered flight list for PDF generation."*

> *"As a backend consumer, I need structured output rows based on selected operational logic (J+1 or J+2), so that the frontend can display editable fields and let the user generate command sheets."*

---

## 🌟 Goal

Refine `.xls` ingestion logic and output behavior:

* User uploads `.xls` file via drag/drop or folder icon (folder icon only, no Google Drive/link upload)
* After upload, two selectable options appear: `Commandes définitives` (J+1) or `Pré-commandes` (J+2)
* App internally computes the current "J" date
* Flight legs must be **reordered and grouped** for visual sequence: e.g., TNR → TLE then TLE → TNR
* Filtered rows are displayed on screen with `J/C` and `Y/C` columns as editable input fields
* PDF generation is **only enabled when all `J/C` and `Y/C` fields are correctly filled** and within aircraft capacity
* Once complete, user clicks **"Generate PDF"** to download the final `.pdf`
* Title of PDF reflects mode (Commandes or Pré-commandes)

---

## 📂 Input

| Field | Type            | Description                               |
| ----- | --------------- | ----------------------------------------- |
| file  | `.xls` stream   | Uploaded Excel flight schedule            |
| mode  | `string`        | `commandes` (J+1) or `precommandes` (J+2) |
| today | `datetime.date` | App-resolved current date (`J`)           |

---

## 📄 Output

### ✅ JSON Response for Display

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
  }
]
```

### 📄 PDF Generation Input

* Same structure as above, with `jc`/`yc` values either defaulted (from backend) or user-edited (in frontend)
* Title of PDF: `COMMANDES DEFINITIVES PRESTATIONS A BORD` or `PRE-COMMANDES PRESTATIONS A BORD`
* Flights must be **grouped by leg pair** before rendering to PDF

---

## ✅ Acceptance Criteria

* ✅ User uploads `.xls` using drag-and-drop or file picker (folder icon only)
* ✅ Mode options shown only after upload
* ✅ Rows filtered by SD LOC date:

  * `commandes` = today + 1
  * `precommandes` = today + 2
* ✅ Output rows contain editable `J/C`, `Y/C` fields
* ✅ `jc`/`yc` default to 0, and:

  * Aircraft-specific max capacities applied from `imma`
  * Return leg adjustments applied for `arrivee == TNR` in `commandes` mode
  * Final jc/yc values clamped to aircraft-specific limits
* ✅ **Generate PDF** button is only available when all JC/YC fields are valid
* ✅ PDF includes correct title based on selected mode
* ✅ **Flights are reordered and grouped into leg pairs** (e.g. outbound/inbound)

---

## 📝 Test Cases

| Scenario                            | Expectation                                       |
| ----------------------------------- | ------------------------------------------------- |
| Upload `.xls` and pick commandes    | Filters rows for J+1, display with editable JC/YC |
| Upload `.xls` and pick precommandes | Filters rows for J+2, same editable interface     |
| Upload malformed `.xls`             | Displays error modal                              |
| Missing required columns            | Reject file with feedback                         |
| JC/YC not filled                    | Disable PDF generation button                     |
| JC/YC out of range (non 0-99)       | Show validation error per row                     |
| JC/YC exceed aircraft capacity      | Clamped before export                             |
| Return leg adjustment logic         | Applied only for `arrivee == TNR` in commandes    |
| Generate PDF                        | Triggers valid file download with correct title   |
| Disordered legs                     | App reorders and pairs for final PDF              |

---

## ❌ Out of Scope

* Category `salon` support (deferred)
* Legacy movement PDF (`Mvt`) generation
* Persisting JC/YC edits to backend (UI-only session state)
