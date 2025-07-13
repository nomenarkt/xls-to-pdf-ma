# 📘 PRD – Feature: Generate Final PDF

## 🧹 Belongs To

* 🧱 Epic: Offline XLS PDF Generator
* 📂 Domain: `pdf`
* 📁 Module: `rendering`
* 🔧 Feature: `generate_pdf`

---

## 👤 User Story

> *"As an airline staff member, after uploading a flight list and filling in the J/C and Y/C for each route, I want to click a button to generate a finalized PDF that summarizes the planned services for each flight, so I can print or transmit it for operational use."*

---

## ✯ Goal

Produce a **non-editable** PDF snapshot of the current structured flight data, titled by mode (e.g., "Commandes définitives"), organized by correct outbound/inbound leg pairings, and enriched with filled JC and YC values for **catering service preparation**.

The PDF is intended for download and printing only.

---

## 💾 Preconditions

* User has uploaded a valid `.xls` file
* User has selected a mode: `Commandes définitives (J+1)` or `Pré-commandes (J+2)`
* Application has already parsed and filtered valid flight rows
* User has filled all JC/YC fields (range 0–99) on screen

---

## 📅 Inputs

| Field   | Type            | Required | Description                      |
| ------- | --------------- | -------- | -------------------------------- |
| flights | list of objects | ✅        | Completed flight data with JC/YC |
| mode    | string enum     | ✅        | `commandes` or `precommandes`    |

---

## 📄 Output

* Binary PDF file
* Headers: `Content-Disposition: attachment; filename="<mode>_<date>.pdf"`
* Format: A4, paysage, printable

Example (for **Commandes définitives** mode on July 12, 2025):

```
Filename: Commandes_définitives_2025-07-12.pdf
```

---

## 📋 Acceptance Criteria

* ✅ All JC/YC values are provided and in range (0–99) before PDF generation
* ✅ Flights appear in correct leg pairings (e.g., outbound/inbound grouped as MD712/MD713)
* ✅ Filename format follows: `Commandes_définitives_YYYY-MM-DD.pdf` or `Pré-commandes_YYYY-MM-DD.pdf`
* ✅ PDF is non-editable (flattened, print-optimized)
* ✅ PDF is A4, landscape orientation, suitable for printing
* ✅ Mode “Commandes définitives” uses J+1, “Pré-commandes” uses J+2
* ✅ Missing JC/YC or invalid values disable the “Générer le PDF” button
* ✅ Download is triggered upon successful response from `/generatePDF`

---

## 🧱 User Flow

1. User uploads `.xls` file
2. App filters rows based on mode logic (J+1 or J+2)
3. User fills JC and YC values for each flight
4. Button **"Générer le PDF"** becomes active
5. App sends payload to backend `/generatePDF`
6. PDF is streamed as download

---

## 🚫 Out of Scope

* Editable fields inside PDF
* Preview-only PDF layout
* Email or remote transmission
* Separate salon logic

---

## 🔐 Permissions

* No authentication needed (offline tool)
* Local-only processing

---

## 📝 Notes

* PDF must not include empty JC/YC values
* All flight leg sorting occurs server-side before layout
* Flight pairings must be human-readable in their natural operational order

