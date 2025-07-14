# TECH\_SPEC.frontend.md

📁 Path: docs/frontend/flight/ingestion\_filtering/parse\_filter/TECH\_SPEC.frontend.md

## 🛍️ Overview

This document defines the technical implementation for the frontend bridge and UI surface responsible for parsing and filtering uploaded `.xls` flight files. The system relies on a Python subprocess and bridges IPC (Inter-Process Communication) into the web interface.

---

## 🛡️ Modules

| Module                       | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `UploadBox.tsx`              | File drop zone and mode/category UI                        |
| `useProcessXLS.ts`           | Frontend hook for invoking IPC bridge and validation       |
| `usePythonSubprocess.ts`     | IPC bridge for Python spawn process                        |
| `FlightTable.tsx`            | Tabular rendering of parsed data and editable class fields |
| `AppContext.tsx`             | Global state (mode, category, flightRows, file)            |
| `buildPythonErrorMessage.ts` | Transforms subprocess stderr to UI-facing error            |

---

## 🔌 Data Contracts

### Input: Modeled from `.xls` content (sent to backend)

```ts
interface XLSRequest {
  inputFilePath: string;
  outputFilePath: string;
  filters: {
    mode: 'arrivee' | 'depart';
    category: 'commercial' | 'militaire';
  };
}
```

### Output: Expected JSON shape from Python process

```ts
type FlightRow = {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
  j_class?: string;
  y_class?: string;
};
```

Returned as a `FlightRow[]` via file contents at `outputFilePath`.

Editable fields `j_class` and `y_class` are supported via backend PATCH to `/process`. For seat-class validation rules, see [docs/flightRow.md](../../../../flightRow.md).

---

## ♻️ Flow

1. **UploadBox.tsx**: Accepts `.xls` file + user inputs (`mode`, `category`).
2. **useProcessXLS.ts**: Validates inputs, invokes `usePythonSubprocess()`.
3. **usePythonSubprocess.ts**:

   * Spawns Python subprocess via Tauri or Node bridge.
   * Monitors `stdout`, `stderr`, `.on('close')`.
   * Reads output `.json` file path and returns `FlightRow[]`.
4. **FlightTable.tsx**:

   * Renders `FlightRow[]` with validation highlighting
   * Provides inline editing of `j_class`, `y_class`
   * Sends PATCH requests when locally edited
5. **AppContext.tsx**: Shares state across UploadBox, Table, and PDF Export modules.

---

## ✅ Validation

### Enum Guard

Both `mode` and `category` undergo runtime validation before IPC is invoked:

```ts
if (!['depart', 'arrivee'].includes(mode)) throw new Error("Invalid mode");
```

### FlightRow Validation

Zod schema validates the resulting JSON rows from the output file:

```ts
const FlightRowSchema = z.object({
  num_vol: z.string(),
  depart: z.string(),
  arrivee: z.string(),
  imma: z.string(),
  sd_loc: z.string(),
  sa_loc: z.string(),
  j_class: z.string().optional(),
  y_class: z.string().optional(),
});
```

---

## 💥 Error Handling

### IPC Failures

* Subprocess spawn errors → surfaced as user-facing banner
* `stderr` content → hidden by default, shown in `debugMode`
* JSON parse error → fallback message: `"Failed to parse XLS – please check file format"`

### PATCH Failures

* If PATCH fails (e.g. editing `j_class` or `y_class`), an error icon is shown inline.
* Failed edits are not persisted or written to PDF export.

---

## 🧪 Tests

| File                             | Tests                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| `useProcessXLS.test.ts`          | Valid mode/category propagation, parse success, fallback error     |
| `usePythonSubprocess.test.ts`    | `.on('error')`, `.on('close')`, bad output file, invalid JSON      |
| `UploadBox.integration.test.tsx` | Upload, mode/category selection, IPC output table rendering        |
| `FlightTable.test.tsx`           | Seat class validation (0-99), editable fields, PATCH error display |

---

## 📌 Notes

* The editable behavior of `j_class` and `y_class` is now spec-compliant and synchronized with backend PATCH support.
* The IPC implementation is aligned with backend `PRD.md`/`TECH_SPEC.backend.md`.
* A `.env.sample` file defines fallback output path and debug mode toggle.
* All subprocess logic is abstracted to `usePythonSubprocess()` and NOT coupled with UI.
