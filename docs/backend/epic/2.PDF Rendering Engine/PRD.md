# 📘 PRD – Epic 2: PDF Rendering Engine

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
