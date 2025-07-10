# 📄 Frontend TECH_SPEC – Feature: `/process` Endpoint Integration

---

## 🔁 Data Flow

1. User selects mode + category
2. UploadBox triggers upload
3. useProcessXLS hook sends `POST /process`
4. JSON response is saved to AppContext
5. Table renders editable rows

---

## 📤 API Call Details

### Endpoint

```http
POST /process
```

### Request Format

- `multipart/form-data`
- Fields:
  - `file` (.xls)
  - `mode` (string)
  - `category` (string)

### Hook

```ts
function useProcessXLS() {
  return async (file, mode, category) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('category', category);
    const res = await axios.post('/process', formData);
    return res.data;
  };
}
```

---

## 🧩 Components

### UploadBox.tsx
- Accepts file
- Calls `useProcessXLS`

### ModeSelector.tsx / CategorySelector.tsx
- Controls form field values

### FlightTable.tsx
- Receives `flightRows` and renders editable fields

---

## 🧪 Tests

| Component     | Test                                       |
|---------------|--------------------------------------------|
| UploadBox     | Upload triggers API with all form fields   |
| useProcessXLS | Successful request → updates context       |
| useProcessXLS | Invalid file → shows error toast           |
| FlightTable   | Renders all columns from parsed rows       |

---

## 🔐 Auth

- None (local app)