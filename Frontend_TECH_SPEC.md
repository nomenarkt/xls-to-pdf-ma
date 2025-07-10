
# 📄 TECH_SPEC.md  
**Frontend – XLS Flight Command App (Local PDF Web Tool)**

---

## 1. 🏗️ Tech Stack

| Layer           | Tech/Tool         | Purpose                            |
|----------------|-------------------|------------------------------------|
| Framework      | React + Vite      | Fast, modular frontend stack       |
| Styling        | Tailwind CSS      | Utility-first CSS for layout/UI    |
| State Mgmt     | React Context     | Global app state (mode, file, table) |
| Form Editing   | Controlled inputs | Live editable fields               |
| Validation     | Zod               | Schema validation for user edits   |
| API Layer      | Axios             | HTTP requests to backend           |
| Testing        | Vitest + RTL      | Unit/UI tests                      |

---

## 2. 📂 Folder Structure

```
/frontend/
├── index.html
├── main.tsx
├── App.tsx
├── api/
│   └── client.ts
│   └── upload.ts
├── components/
│   └── ModeSelector.tsx
│   └── UploadBox.tsx
│   └── EditableTable.tsx
│   └── DownloadButton.tsx
├── context/
│   └── AppContext.tsx
├── hooks/
│   └── useUpload.ts
│   └── usePDF.ts
├── utils/
│   └── tableSchema.ts
├── types/
│   └── flight.ts
└── __tests__/
    └── components/*.test.tsx
```

---

## 3. 📋 State Management and Data Flow

```ts
interface AppState {
  mode: 'pre' | 'def';
  category: 'salon' | 'pab';
  xlsData: RawXLSData;
  tableData: EditableFlightData[];
}
```

---

## 4. 📤 API Integration

### a. `POST /upload`
- Body: FormData with `.xls` file
- Response: JSON table rows based on mode + date filter

### b. `POST /generate_pdf`
- Body: JSON table payload
- Response: Blob (PDF)

---

## 5. 🖼️ UI Elements

### 1. ModeSelector
- 2 toggles: Mode and Category

### 2. UploadBox
- Drag & drop or file picker
- Accepts only `.xls`

### 3. EditableTable
- Dynamically rendered table with editable fields

### 4. DownloadButton
- Triggers PDF generation and download

---

## 6. 📏 Layout Rules

- Responsive, flex layout, scrollable table
- Tailwind breakpoints, max width `xl`

---

## 7. 🔐 Local/Offline Execution

- Fully functional via `localhost`
- No auth, no third-party CDN

---

## 8. 🧪 Unit Test Strategy

| Component        | Tests                                               |
|------------------|-----------------------------------------------------|
| ModeSelector     | Button clicks toggle correct values                 |
| UploadBox        | Accepts `.xls`, triggers upload                     |
| EditableTable    | Editable fields update context                      |
| DownloadButton   | Calls generate endpoint, triggers file download     |

Tools: Vitest + React Testing Library
