# 🧩 Frontend Feature Backlog

💻 Codex Task: Hook – usePythonSubprocess
🧭 Context: frontend | shared
📁 Platform: shared
🎯 Objective: Spawn a backend Python subprocess with typed arguments and capture its structured output.
🧩 Specs:
- Params: `{ mode: Mode; category: Category }`
- Mode and Category: strict union types
- Behavior:
  - Spawns a subprocess using a configured Python entrypoint
  - Parses stdout (expecting JSON)
  - Catches stderr or timeouts as error states
- Return: `{ data?: T; error?: string; status: 'idle' | 'loading' | 'success' | 'error' }`
- Environment: uses `NEXT_PUBLIC_API_BASE_URL` or fallback default
- Fallback: Local mode stubbed with a mock response in test

🧪 Tests:
- ✅ Unit: mock `child_process.spawn` to test stdout, stderr, invalid JSON, timeouts
- ✅ Validate typed input (Mode/Category enums only)
- ✅ Integration: simulate call via upload flow with XLS file and assert parsed result
- ✅ Ensure hook error boundary does not break app

--------------------------------

## ✅ Epic: Flight File Ingestion & Filtering

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

### 💻 Codex Task: Seat Class Validation
🧭 Context: frontend
📁 Platform: web
🎯 Objective: Enforce numeric validation rules for `j_class` and `y_class`
🧩 Specs:
* Inputs min `0`, max `99`, step `1`
* Letters or decimals blocked
* Negative or >99 values show error with red border
* Invalid fields prevent update until corrected
🧪 Tests:
* Typing `-1`, `abc`, `100` → error highlight
* Typing `23`, `0`, `99` → valid
* Blur triggers validation display
* Error clears when corrected

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







