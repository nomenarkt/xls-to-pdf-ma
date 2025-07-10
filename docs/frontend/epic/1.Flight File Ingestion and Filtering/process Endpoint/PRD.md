
# 📘 Frontend PRD – Feature: `/process` Endpoint Integration

## 🧩 Belongs To

🧱 Epic: Flight File Ingestion and Filtering  
🔗 Backend Feature: `/process` FastAPI endpoint

---

## 🎯 Goal

Allow users to upload a `.xls` flight plan file, select mode and category, and receive a filtered flight list for table rendering and editing.

---

## 👤 User Story

> "As an airline staff user, when I upload a flight file and choose mode/category, I want to see only the relevant filtered flights for the right date."

---

## 📥 Input (from UI)

| Field     | UI Source         | Required | Values                             |
|-----------|-------------------|----------|------------------------------------|
| file      | UploadBox         | ✅       | `.xls` file                        |
| mode      | ModeSelector      | ✅       | `commandes` or `precommandes`      |
| category  | CategorySelector  | ✅       | `salon` or `prestations`           |

---

## 📤 Output

Structured array of filtered flight rows:

```json
[
  {
    "num_vol": "AF1234",
    "depart": "CDG",
    "arrivee": "JFK",
    "imma": "F-HZUA",
    "sd_loc": "2025-07-11T10:00:00",
    "sa_loc": "2025-07-11T13:00:00"
  },
  ...
]
```

---

## ✅ Acceptance Criteria

- [x] File is submitted with mode + category
- [x] Response data is rendered into editable table
- [x] User sees loading/error states for upload process
- [x] Table UI is not shown until valid data received

---

