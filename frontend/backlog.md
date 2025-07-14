## 🧩 Frontend Feature Backlog

### 💻 Codex Task: `Flight Table UI – FlightTable`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Display filtered flight data with inline validations and edit capabilities
🧱 **Module**: `FlightTable`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: Table View Renderer

🧲 **Specs**:

* **Props**: `data: FlightRow[]`, `errors: RowError[]`, `onEdit(row: FlightRow): void`
* **UI Design**: Tailwind + design tokens
* **Behavior**:

  * Render table with error badges
  * Conditional row styling (invalid vs. valid)
  * Inline editing for `j_class` and `y_class`
  * Send PATCH requests on edit
* **Routing**: none

🧪 **Tests**:

* Render rows with and without errors
* Validate classnames (error row, selected row)
* Simulate edit and PATCH
* Row count and content checks

---

### 💻 Codex Task: `Upload Flow Coordinator – useUploadFlow()`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Manage XLS upload and hook chaining into filtered + editable output
🧱 **Module**: `useUploadFlow`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: Upload Coordinator

🧲 **Specs**:

* **Inputs**: `onUpload(file: File)`
* **State**: `rawBuffer`, `parsedRows`, `editedRows`, `errors`
* **Hook Chain**: `usePythonSubprocess` (for CLI), `useProcessXLS` (for parsing)
* **Behavior**: orchestrates upload → parse → edit → render flow
* **Routing**: none

🧪 **Tests**:

* Simulate file drop/upload
* Hook integration correctness
* PATCH propagation and error handling
* Edited rows reconciled after rerender

---

### 💻 Codex Task: `CLI Subprocess Handler – usePythonSubprocess()`

🗬 **Context**: frontend
📁 **Platform**: web
🎯 **Objective**: Spawn Python-based XLS parsing subprocess (Node context)
🧱 **Module**: `usePythonSubprocess`
📦 **Epic**: Flight Parsing Flow
🔧 **Feature**: CLI Integration

🧲 **Specs**:

* **Input**: filepath, args
* **Returns**: `{ stdout, stderr, exitCode }`
* **Behavior**: Calls backend CLI via `child_process.spawn`
* **Routing**: none

🧪 **Tests**:

* Valid XLS triggers correct CLI command
* Handle error codes + stderr output
* Runtime safety for CLI args
