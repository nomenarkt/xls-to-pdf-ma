# 🧩 Frontend Feature Backlog

## ✅ Epic: Flight File Ingestion & Filtering

### 💻 Codex Task: Table Renderer - FlightTable
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Render editable table from flight data
🧩 Specs:
* Props: `rows: FlightRow[]`, `onChange(row)`
* UI: Tailwind scrollable table
* Editable fields: `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`
🧪 Tests:
* Renders correct columns and rows
* Inputs update state on change

--------------------------------

### 💻 Codex Task: IPC Bridge - usePythonSubprocess()
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Bridge to launch Python subprocess with XLS input/output
🧩 Specs:
* Input: inputFilePath, outputFilePath, filters
* Logic:
  * Use `spawn()` or Tauri's backend bridge
  * Pipe input, listen for success/error
🧪 Tests:
* Simulate process success
* Capture stderr on error

--------------------------------

### 💻 Codex Task: Ensure ModeSelector is consumed in parent screen
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Render `ModeSelector` in the parent UI (XLS upload + table context) and wire its output
🧩 Specs:
* Use global context or prop drilling to pass `mode` and `category`
* Ensure it's visible and functional on the Upload+Table screen
🧪 Tests:
* Component appears in DOM tree
* Prop values propagate to `useProcessXLS` correctly

--------------------------------

### 💻 Codex Task: Add Storybook stories for ModeSelector
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Add isolated stories for `ModeSelector` for visual regression and testing
🧩 Specs:
* Default view
* Mode toggled
* Category toggled
* Active states visually distinct
🧪 Tests:
* Render all toggle states
* Actions tab logs changes via `onChange` handler

--------------------------------

## ✅ Epic: Generate PDF
### 💻 Codex Task: Submit PDF Data - useGeneratePDF()
🧭 Context: frontend
📁 Platform: web
🎯 Objective: POST edited table data to `/generate_pdf`, receive blob
🧩 Specs:
* Input: JSON table
* Output: PDF blob
🧪 Tests:
* Valid payload returns PDF
* Failures show error state

--------------------------------

### 💻 Codex Task: DownloadPDFButton
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Trigger download of returned PDF
🧩 Specs:
* Props: `onDownload()`
* UI: Tailwind button
* Behavior: Spinner during download
🧪 Tests:
* Button click triggers download
* Handles blob correctly

--------------------------------

## 🧱 Shared/Core
### 💻 Codex Task: Global State - AppContext.tsx
🧭 Context: shared
📁 Platform: web
🎯 Objective: Provide app-wide context for mode, file, table data
🧩 Specs:
* Keys: `mode`, `category`, `xlsFile`, `flightRows`
* Uses `createContext`, `useReducer`
🧪 Tests:
* State updates on dispatch
* Context access across tree

--------------------------------

### 💻 Codex Task: Shared Types - flight.ts
🧭 Context: shared
📁 Platform: web
🎯 Objective: Define types for rows, fields, payloads
🧩 Specs:
```ts
export interface FlightRow {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
}
```
🧪 Tests: N/A (type-only)

--------------------------------

### 💻 Codex Task: Axios Client - api/axios.ts
🧭 Context: shared
📁 Platform: web
🎯 Objective: Shared axios instance with baseURL, interceptors
🧪 Tests:
* Ensure baseURL works
* Mocks usable for testing hooks






