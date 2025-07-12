# 🧩 Frontend Feature Backlog
-------------------------------

### 💻 Codex Task: Add expect.assertions() to subprocess tests
🧭 Context: shared
📁 Platform: shared
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: IPC Error Handling
🏷 Module: usePythonSubprocess.test.ts
🎯 Objective: Enforce test rigor by requiring at least one assertion in async subprocess test blocks
🧩 Specs:
* Wrap relevant test blocks in `usePythonSubprocess.test.ts` with `expect.assertions(n)`
* Target tests handling `.on('error')`, `.on('close')`, and `Promise.reject`
🧪 Tests:
* Validate tests fail when async assertions aren’t fulfilled
* Confirm no false positives on promise rejection

-------------------------------

### 💻 Codex Task: Propagate stderr on signal-based exit
🧭 Context: shared
📁 Platform: shared
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: IPC Error Handling
🏷 Module: usePythonSubprocess.ts
🎯 Objective: Ensure `stderr` is included when the subprocess exits via `.exit()` or `.close()` with signal or error
🧩 Specs:
* Extend `usePythonSubprocess.ts` to inspect `stderr` even on `.close()`
* Prioritize stderr inclusion if present
🧪 Tests:
* Simulate signal-based `.close()` with stderr populated
* Ensure error message includes stderr in debug mode

-------------------------------

### 💻 Codex Task: Inline schema or example for FlightRow
🧭 Context: shared
📁 Platform: web
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: IPC Developer Experience
🏷 Module: usePythonSubprocess.ts
🎯 Objective: Embed developer-facing schema details near the subprocess hook to improve dev ergonomics
🧩 Specs:
* Import and reference Zod schema (`FlightRowSchema`) if defined
* OR include short field example directly in JSDoc of `usePythonSubprocess.ts`
🧪 Tests:
* N/A (doc-only)

-------------------------------

### 💻 Codex Task: Standardize userEvent.setup() across test files
🧭 Context: frontend
📁 Platform: web
🏷 Epic: XLS Upload UX
🏷 Feature: UI Testing Consistency
🏷 Module: ModeSelector, UploadFlow, FlightTable
🎯 Objective: Ensure all tests using `userEvent` use consistent setup and teardown
🧩 Specs:
* Refactor all test files using `userEvent` to initialize via `userEvent.setup()`
* Remove direct `fireEvent` references
🧪 Tests:
* No change in behavior; visual diff baseline must remain stable

-------------------------------

### 💻 Codex Task: Extract renderWithUser utility
🧭 Context: frontend
📁 Platform: web
🏷 Epic: XLS Upload UX
🏷 Feature: UI Testing Consistency
🏷 Module: test-utils/
🎯 Objective: Avoid repeated setup boilerplate when rendering components with `userEvent`
🧩 Specs:
* Create `test-utils/renderWithUser.ts`
* Include wrapper with `userEvent.setup()` and RTL’s `render()`
🧪 Tests:
* Replace direct `render(...)` + `userEvent.setup()` combo with utility
* Snapshot or behavior tests pass unchanged

-------------------------------

### 💻 Codex Task: Add drag-and-drop tests for UploadBox
🧭 Context: frontend
📁 Platform: web
🏷 Epic: XLS Upload UX
🏷 Feature: File Upload UX
🏷 Module: UploadBox.test.tsx
🎯 Objective: Simulate drag-and-drop interaction on `UploadBox` component
🧩 Specs:
* Extend `UploadBox.test.tsx` with `DataTransfer` mocks
* Trigger `dragEnter`, `drop` events
🧪 Tests:
* Drop triggers file parsing
* UI updates on hover and drop

-------------------------------

### 💻 Codex Task: Improve subprocess error surfacing for UI
🧭 Context: shared
📁 Platform: shared
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: IPC Error Handling
🏷 Module: usePythonSubprocess.ts
🎯 Objective: Refine how errors from the Python subprocess are surfaced to the UI, improving user clarity and consistency with other schema validation flows.
>Prerequisite: Propagate stderr on signal-based exit
🧩 Specs:
- Create a `ZodErrorAdapter` or compatible transformer that maps `buildPythonErrorMessage()` output into a structured, UI-safe error (title, description, optional stderr).
- Extend `usePythonSubprocess.ts` to:
  - Include a `debugMode` flag (default: false)
  - Conditionally include `stderr` output in the returned error only if `debugMode === true`
  - Default UI error to show high-level context message only (e.g., `"Failed to parse XLS – please check file format"`).
- Add dev comment where stderr is stripped, so debuggers know how to enable.

🧪 Tests:
- Mock subprocess responses with and without `stderr`, in both debug/normal mode
- Confirm UI surface only includes `stderr` if debug enabled
- Validate adapter works with `ZodError`, `SyntaxError`, and generic fallback

-------------------------------

### 💻 Codex Task: IPC Bridge - usePythonSubprocess()
🧭 Context: frontend
📁 Platform: web
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: IPC Integration
🏷 Module: usePythonSubprocess.ts
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
🏷 Epic: XLS Upload UX
🏷 Feature: ModeSelector Wiring
🏷 Module: Upload+Table Screen
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
🏷 Epic: XLS Upload UX
🏷 Feature: ModeSelector Component
🏷 Module: ModeSelector
🎯 Objective: Add isolated stories for `ModeSelector` for visual regression and testing
🧩 Specs:
* Default view
* Mode toggled
* Category toggled
* Active states visually distinct
🧪 Tests:
* Render all toggle states
* Actions tab logs changes via `onChange` handler

### 💻 Codex Task: Submit PDF Data - useGeneratePDF()
🧭 Context: frontend
📁 Platform: web
🏷 Epic: PDF Export
🏷 Feature: Table-to-PDF Submission
🏷 Module: useGeneratePDF.ts
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
🏷 Epic: PDF Export
🏷 Feature: PDF File Download
🏷 Module: DownloadPDFButton.tsx
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
🏷 Epic: XLS Upload UX
🏷 Feature: App-Wide Context
🏷 Module: AppContext.tsx
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
🏷 Epic: Flight File Ingestion & Filtering
🏷 Feature: Schema Definition
🏷 Module: flight.ts
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
🏷 Epic: API Integration
🏷 Feature: Shared Data Layer
🏷 Module: api/axios.ts
🎯 Objective: Provide base axios instance with shared config
🧩 Specs:
-Set baseURL
-Add error/response interceptors
 🧪 Tests:
-Valid baseURL
-Unit tests for hook integration
