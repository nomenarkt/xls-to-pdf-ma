# 📘 Product Requirements Document (PRD)

## 🧱 Epic: XLS-Based Flight Command Processor

### 🎯 Goal

Transform a raw `.xls` flight listing into command-ready, fully editable PDF sheets for airline operations, filtered by date (J+1 or J+2), mode (Pré-commandes or Commandes Définitives), and category (Salon or Prestations à Bord).

---

## 📤 Command Types

| Mode                                       | Filter Target Date |
|-------------------------------------------|---------------------|
| Pré-commandes – Prestations à Bord        | Today + 2 days (J+2) |
| Pré-commandes – Salon                     | Today + 2 days (J+2) |
| Commandes Définitives – Prestations à Bord| Today + 1 day (J+1) |
| Commandes Définitives – Salon             | Today + 1 day (J+1) |

> Example: If today is July 10, 2025
> - Pré-commandes = July 12 flights
> - Commandes Définitives = July 11 flights

---

## 📂 Input

- File: `.xls` containing multi-day flight schedule
- Columns extracted:
  - `Num Vol`, `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`

---

## 📑 Output Format: Prestations à Bord

| Column       | Description                                 |
|--------------|---------------------------------------------|
| Date         | From `SD LOC` (only for outbound flights)   |
| Num Vol      | Flight number                               |
| Départ       | Departure airport code                      |
| Arrivée      | Arrival airport code                        |
| Imma         | Aircraft registration (outbound only)       |
| SD LOC       | Scheduled departure (local time)            |
| SA LOC       | Scheduled arrival (local time)              |
| J/C          | Editable in PDF                             |
| Y/C          | Editable in PDF                             |

- Flights are grouped in outbound/return pairs
- Return flight omits `Date` and `Imma`, but remains fully editable

---

## 📑 Output Format: Salon

| Column       | Description                                 |
|--------------|---------------------------------------------|
| Date         | From `SD LOC` (only for outbound flights)   |
| Num Vol      | Flight number                               |
| SD LOC       | Scheduled departure (local time)            |
| Nbre         | Editable in PDF                             |
| Mvt          | Calculated from SD LOC time, but editable   |

### 🍽️ Mvt Calculation

| Time Range (SD LOC)        | Mvt     |
|----------------------------|----------|
| `03:00` → `09:30`          | BRUNCH   |
| Else                       | LUNCH    |

- Applies only to outbound flights
- Inbound flights omit Mvt

---

## ✍️ Editable PDF Requirement

All fields, not just inputs, must be editable in the final PDF:

| Field     | Editable? |
|-----------|-----------|
| Date      | ✅         |
| Num Vol   | ✅         |
| Départ    | ✅         |
| Arrivée   | ✅         |
| Imma      | ✅         |
| SD LOC    | ✅         |
| SA LOC    | ✅         |
| J/C       | ✅         |
| Y/C       | ✅         |
| Nbre      | ✅         |
| Mvt       | ✅         |

---

## ✅ User Journey

1. Upload `.xls` file
2. Select mode (e.g., Commandes Définitives – Salon)
3. App filters flights for J+1 or J+2
4. Flight rows are grouped and displayed
5. All fields are editable in-browser and in PDF
6. User downloads editable PDF formatted per template
