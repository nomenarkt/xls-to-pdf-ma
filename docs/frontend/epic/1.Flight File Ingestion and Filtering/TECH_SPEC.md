# 📄 TECH_SPEC – Epic 1: Flight File Ingestion & Filtering

---

## 1. 📦 Tech Stack

| Layer      | Tech              |
| ---------- | ----------------- |
| Framework  | React + Vite      |
| Styling    | Tailwind          |
| Forms      | Controlled inputs |
| API Layer  | Axios             |
| State Mgmt | Context API       |
| Validation | Zod               |
| Testing    | Vitest + RTL      |

---

## 2. 📂 Folder Layout

```
/frontend/
├── components/
│   ├── ModeSelector.tsx
│   ├── CategorySelector.tsx
│   ├── UploadBox.tsx
│   └── FlightTable.tsx
├── context/AppContext.tsx
├── hooks/useProcessXLS.ts
├── api/upload.ts
└── types/flight.ts
```

---

## 3. 🔁 Data Flow

1. User selects mode + category
2. Upload `.xls` file
3. Hook sends data to `/process`
4. JSON rows are stored in context
5. Table is rendered and editable

---

## 4. 📤 API Integration

```ts
POST /process

form-data: {
  file: .xls
  mode: 'precommandes' | 'commandes'
  category: 'salon' | 'prestations'
}

Response: FlightRow[]
```

---

## 5. 🧩 Component Interfaces

### `ModeSelector`

* Props: `value`, `onChange`
* Values: `'precommandes'` | `'commandes'`

### `CategorySelector`

* Props: `value`, `onChange`
* Values: `'salon'` | `'prestations'`

### `UploadBox`

* Accepts `.xls`
* On drop: triggers upload

### `FlightTable`

* Props: `rows: FlightRow[]`
* Renders editable fields

---

## 6. 🧪 Tests

| Component     | Test                           |
| ------------- | ------------------------------ |
| UploadBox     | Accepts `.xls`, triggers POST  |
| ModeSelector  | Updates state                  |
| FlightTable   | Renders rows, editable inputs  |
| useProcessXLS | Sends request, parses response |

---
