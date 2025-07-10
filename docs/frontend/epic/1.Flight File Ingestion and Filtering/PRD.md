Here’s the **Frontend PRD** and updated **Frontend TECH\_SPEC** scoped to **Epic 1: Flight File Ingestion & Filtering** based on the backend specs you provided.

---

# 📘 Frontend PRD – Epic 1: Flight File Ingestion & Filtering

## 🎯 Goal

Enable users to upload a `.xls` file and view a filtered flight listing based on:

* Mode: `Pré-commandes` (J+2) or `Commandes Définitives` (J+1)
* Category: `Salon` or `Prestations à Bord`

The frontend must render a table of editable rows from the backend `/process` response.

---

## 👤 Users

* Airline back-office agents who interact with the local web tool.

---

## 🧪 Acceptance Criteria

* [x] User can select a mode and category
* [x] User uploads a `.xls` file
* [x] UI submits `POST /process` with correct fields
* [x] Returned JSON is rendered as editable table
* [x] Error states shown for invalid file or bad server response

---

## 📂 Input Fields

| Field    | UI Element       | Required | Source      |
| -------- | ---------------- | -------- | ----------- |
| file     | UploadBox        | ✅        | User upload |
| mode     | ModeSelector     | ✅        | User toggle |
| category | CategorySelector | ✅        | User toggle |

---

## 📤 Output

Editable table populated with:

* Num Vol, Départ, Arrivée, Imma, SD LOC, SA LOC

---

## 🖼️ Layout

* Top: toggles for mode + category
* Middle: drag-and-drop `.xls` upload
* Bottom: editable table (scrollable)

---