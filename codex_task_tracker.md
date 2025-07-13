🗂️ Codex Task Tracker (SDLC Phase View | Status: To do, In Progress, Done | Context: backend/frontend/... | Notes: Technical and functional documentation)

| Context | Task Title | Phase | Status | Layer | Domain | Module | Epic | Feature | Description | Test Status | Created | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| backend | Python task logger utilities | context | ✅ Done | - | - | internal.context | Task logging | Codex Tracker | python port of go utilities | - | 2025-07-10 | 2025-07-11 |
| backend | Table-driven tests for task_logger | context | ✅ Done | - | - | internal.context | Task logging | Codex Tracker | added pytest table-driven tests | - | 2025-07-10 | 2025-07-11 |
| backend | Create backend folder structure | context | ✅ Done | - | - | setup | Setup | Initial Scaffolding | added delivery/usecase/repository directories | - | 2025-07-10 | 2025-07-11 |
| backend | Create backend requirements file | context | ✅ Done | - | - | setup | Setup | Initial Scaffolding | added requirements.txt and docs | - | 2025-07-10 | 2025-07-11 |
| backend | ParseAndFilterXLS() | usecase | ✅ Done | - | - | repository | Data Handling | Flight Parsing | implemented parser in backend/repository/xls_parser.py | - | 2025-07-10 | 2025-07-11 |
| backend | /process endpoint | delivery | ✅ Done | - | - | delivery | Data Handling | Flight Parsing | implemented FastAPI route | - | 2025-07-10 | 2025-07-11 |
| backend | Fix root AGENT Codex Rule bullet | docs | ✅ Done | - | - | documentation | Docs | Governance | completed bullet text and newline | - | 2025-07-11 | 2025-07-11 |
| backend | Add openpyxl requirement | context | ✅ Done | - | - | setup | Setup | Dependencies | added openpyxl dependency and CI install step | - | 2025-07-11 | 2025-07-11 |
| frontend | Prefix subtasks in appendTaskLog | context | ✅ Done | - | - | - | - | - | ts logger with parentTaskName | - | 2025-07-11 | 2025-07-11 |
| frontend | Upload XLS - UploadBox | ui | ✅ Done | - | - | UploadBox.tsx | XLS Upload UX | File Upload UI | initial implementation | - | 2025-07-11 | 2025-07-11 |
| frontend | Update frontend task logger | context | ✅ Done | - | - | - | - | - | switched to codex_task_tracker.md | - | 2025-07-11 | 2025-07-11 |
| frontend | Add jest-environment-jsdom | context | ✅ Done | - | - | - | - | - | added dev dependency | - | 2025-07-11 | 2025-07-11 |
| frontend | Mode/Category Toggle - ModeSelector | ui | ✅ Done | - | - | ModeSelector.tsx | XLS Upload UX | ModeSelector Component | implemented ModeSelector with tests | - | 2025-07-11 | 2025-07-11 |
| frontend | Parse XLS Hook - useProcessXLS() | hooks | ✅ Done | - | - | useProcessXLS.ts | Flight File Ingestion & Filtering | XLS Filtering Logic | implemented useProcessXLS and tests | - | 2025-07-11 | 2025-07-11 |
| frontend | Fix safer-buffer dependency for npm tests | context | ✅ Done | - | - | - | - | - | added safer-buffer dependency | - | 2025-07-11 | 2025-07-11 |
| frontend | Integration Test – UploadBox + ModeSelector + useProcessXLS | ui | ✅ Done | - | - | UploadFlow.integration.test.tsx | XLS Upload UX | Integrated Upload Flow | integration test added | - | 2025-07-11 | 2025-07-11 |
| frontend | Document FlightRow structure for editor UI | docs | ✅ Done | - | - | docs/flightRow.md | Flight File Ingestion & Filtering | Schema Definition | added J/C and Y/C docs | - | 2025-07-11 | 2025-07-11 |
| frontend | Fix editable field definition in FlightRow TECH_SPEC | docs | ✅ Done | - | - | - | - | - | clarify editable j/y fields | - | 2025-07-11 | 2025-07-11 |
| frontend | Rewrite duplicates in updateTaskTracker | context | ✅ Done | - | - | - | - | - | rewrite duplicate rows and add tests | - | 2025-07-11 | 2025-07-11 |
| frontend | Extend FlightRow with seat classes | shared | ✅ Done | - | - | - | - | - | add j_class and y_class fields; update tests | - | 2025-07-12 | 2025-07-12 |
| frontend | Table Renderer – FlightTable | ui | ✅ Done | - | - | FlightTable.tsx | XLS Upload UX | Table UI | implement table component | - | 2025-07-12 | 2025-07-12 |
| frontend | Seat Class Validation - FlightTable | ui | ✅ Done | - | - | FlightTable.tsx | XLS Upload UX | Data Validation | j/y class validation 0-99 with error state | - | 2025-07-12 | 2025-07-12 |
| frontend | IPC Bridge Documentation | docs | ✅ Done | - | - | - | - | - | PRD + TECH_SPEC for Python subprocess bridge | - | 2025-07-12 | 2025-07-12 |
| frontend | Update useProcessXLS types | hooks | ✅ Done | - | - | useProcessXLS.ts | Flight File Ingestion & Filtering | Type Definitions | update hook to use Mode and Category types | - | 2025-07-12 | 2025-07-12 |
| frontend | Add runtime validation to useProcessXLS | hooks | ✅ Done | - | - | useProcessXLS.ts | Flight File Ingestion & Filtering | Runtime Safety | runtime checks for Mode/Category enums | - | 2025-07-12 | 2025-07-12 |
| shared | Normalize backlog cleanup hyphen | context | ✅ Done | - | - | - | - | - | handle hyphen names in cleanup | - | 2025-07-12 | 2025-07-12 |
| frontend | Document environment variables (.env.sample) | docs | ✅ Done | - | - | - | - | - | added env sample and README steps | - | 2025-07-12 | 2025-07-12 |
| frontend | Hook – usePythonSubprocess | hooks | ✅ Done | - | - | usePythonSubprocess.ts | Flight File Ingestion & Filtering | IPC Integration | spawn Python subprocess with typed args | - | 2025-07-12 | 2025-07-12 |
| frontend | Extend usePythonSubprocess.test error cases | hooks | ✅ Done | - | - | usePythonSubprocess.test.ts | Flight File Ingestion & Filtering | IPC Error Handling | add error and signal rejection tests | - | 2025-07-12 | 2025-07-12 |
| frontend | usePythonSubprocess JSDoc outputFile | hooks | ✅ Done | - | - | usePythonSubprocess.ts | Flight File Ingestion & Filtering | IPC Developer Experience | document JSON FlightRow array requirement | - | 2025-07-12 | 2025-07-12 |
| Codex | Python error helper | hooks | ✅ Done | - | - | buildPythonErrorMessage.ts | Flight File Ingestion & Filtering | IPC Error Handling | improve subprocess error messages | - | 2025-07-12 | 2025-07-12 |
| frontend | UserEvent migration | ui | ✅ Done | - | - | UploadBox.test.tsx, ModeSelector.test.tsx | XLS Upload UX | UI Testing Consistency | replace fireEvent with userEvent | - | 2025-07-12 | 2025-07-12 |
