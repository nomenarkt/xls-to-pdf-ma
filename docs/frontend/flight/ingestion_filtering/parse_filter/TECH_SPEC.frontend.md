# TECH_SPEC.frontend.md

📁 Path: docs/frontend/flight/ingestion_filtering/parse_filter/TECH_SPEC.frontend.md

## 🛍️ Overview

This document defines the technical implementation for the frontend bridge and UI surface responsible for parsing and filtering uploaded `.xls` flight files. The system relies on a Python subprocess and bridges IPC (Inter-Process Communication) into the web interface.

---

## 🛡️ Modules

| Module                                    | Purpose                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `UploadBox.tsx`                           | File drop zone and mode/category UI                                        |
| `useProcessXLS.ts`                        | Frontend hook for invoking IPC bridge and validation                       |
| `usePythonSubprocess.ts`                  | IPC bridge for Python spawn process                                        |
| `FlightTable.tsx`                         | Tabular rendering of parsed data and editable class fields                 |
| `AppContext.tsx`                          | Global state (mode, category, flightRows, file)                            |
| `shared/hooks/buildPythonErrorMessage.ts` | Transforms subprocess stderr to UI-facing error                            |
| `useUploadFlow.ts`                        | Orchestrates file upload through subprocess parsing and PATCH update chain |

---

## 🔌 Data Contracts

### Input: Modeled from `.xls` content (sent to backend)

```ts
interface XLSRequest {
  inputFilePath: string;
  outputFilePath: string;
  filters: {
    mode: "arrivee" | "depart";
    category: "commercial" | "militaire";
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
  jc?: string;
  yc?: string;
};
```

The Python script writes a JSON array to `outputFilePath` for later parsing.

Editable fields `jc` and `yc` are supported via backend PATCH to `/process`. For seat-class validation rules, see [docs/flightRow.md](../../../../flightRow.md).

---

## ♻️ Flow

1. **UploadBox.tsx**: Accepts `.xls` file + user inputs (`mode`, `category`).
2. **useProcessXLS.ts**: Validates inputs, invokes `usePythonSubprocess()`.
3. **usePythonSubprocess.ts**:
   - Spawns Python subprocess via Tauri or Node bridge.
   - Monitors `stdout`, `stderr`, `.on('close')`.
   - Resolves with `{ stdout, stderr, exitCode }` when the process closes.

4. **FlightTable.tsx**:
   - Renders `FlightRow[]` with validation highlighting

- Provides inline editing of `jc`, `yc`
- Sends PATCH requests when locally edited

5. **AppContext.tsx**: Shares state across UploadBox, Table, and PDF Export modules.
6. **useUploadFlow\.ts**:
   - Handles full chain: upload → subprocess → editable UI
   - Tracks `editedRows`, triggers PATCH calls, reconciles state

---

## ✅ Validation

### Enum Guard

Both `mode` and `category` undergo runtime validation before IPC is invoked:

```ts
if (!["depart", "arrivee"].includes(mode)) throw new Error("Invalid mode");
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
  jc: z.string().optional(),
  yc: z.string().optional(),
});
```

---

## 💥 Error Handling

### IPC Failures

- Subprocess spawn errors → surfaced as user-facing banner
- `stderr` content → hidden by default, shown in `debugMode`
- JSON parse error → fallback message: `"Failed to parse XLS – please check file format"`

### PATCH Failures

- If PATCH fails (e.g. editing `jc` or `yc`), an error icon is shown inline.
- Failed edits are not persisted or written to PDF export.

---

## 🧪 Tests

| File                             | Tests                                                                  |
| -------------------------------- | ---------------------------------------------------------------------- |
| `useProcessXLS.test.ts`          | Valid mode/category propagation, parse success, fallback error         |
| `usePythonSubprocess.test.ts`    | `.on('error')`, `.on('close')`, bad output file, invalid JSON          |
| `UploadBox.integration.test.tsx` | Upload, mode/category selection, IPC output table rendering            |
| `FlightTable.test.tsx`           | Seat class validation (0-99), editable fields, PATCH error display     |
| `useUploadFlow.test.ts`          | Upload → parse → edit flow, PATCH call verification, rollback on error |

---

## 📌 Notes

- The editable behavior of `jc` and `yc` is now spec-compliant and synchronized with backend PATCH support.
- The IPC implementation is aligned with backend `PRD.md`/`TECH_SPEC.backend.md`.
- A `.env.sample` file defines fallback output path and debug mode toggle.
- All subprocess logic is abstracted to `usePythonSubprocess()` and NOT coupled with UI.

---

## 🧩 Frontend Feature Backlog

### 💻 Codex Task: `Flight Table UI – FlightTable`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Display filtered flight data with inline validations and edit capabilities
🧱 **Module**: `FlightTable`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: Table View Renderer

🧲 **Specs**:

- **Props**: `data: FlightRow[]`, `errors: RowError[]`, `onEdit(row: FlightRow): void`
- **UI Design**: Tailwind + design tokens
- **Behavior**:
  - Render table with error badges
  - Conditional row styling (invalid vs. valid)
  - Inline editing for `jc` and `yc`
  - Send PATCH requests on edit

- **Routing**: none

🧪 **Tests**:

- Render rows with and without errors
- Validate classnames (error row, selected row)
- Simulate edit and PATCH
- Row count and content checks

---

### 💻 Codex Task: `Upload Flow Coordinator – useUploadFlow()`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Manage XLS upload and hook chaining into filtered + editable output
🧱 **Module**: `useUploadFlow`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: Upload Coordinator

🧲 **Specs**:

- **Inputs**: `onUpload(file: File)`
- **State**: `rawBuffer`, `parsedRows`, `editedRows`, `errors`
- **Hook Chain**: `usePythonSubprocess` (for CLI), `useProcessXLS` (for parsing)
- **Behavior**: orchestrates upload → parse → edit → render flow
- **Routing**: none

🧪 **Tests**:

- Simulate file drop/upload
- Hook integration correctness
- PATCH propagation and error handling
- Edited rows reconciled after rerender

---

### 💻 Codex Task: `CLI Subprocess Handler – usePythonSubprocess()`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Spawn Python-based XLS parsing subprocess (Node context)
🧱 **Module**: `usePythonSubprocess`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: CLI Integration

🧲 **Specs**:

- **Input**: filepath, args
- **Returns**: `{ stdout, stderr, exitCode }`
- **Behavior**: Calls backend CLI via `child_process.spawn`
- **Routing**: none

🧪 **Tests**:

- Valid XLS triggers correct CLI command
- Handle error codes + stderr output
- Runtime safety for CLI args
