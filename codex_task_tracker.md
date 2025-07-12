🗂️ Codex Task Tracker (SDLC Phase View | Status: To do, In Progress, Done | Context: backend/frontend/... | Notes: Technical and functional documentation)

| **Task Title**                                              | **Phase** | **Status** | **Context** | **Notes**                                              | **Created** | **Updated** |
| ----------------------------------------------------------- | --------- | ---------- | ----------- | ------------------------------------------------------ | ----------- | ----------- |
| Python task logger utilities                                | context   | ✅ Done    | backend     | python port of go utilities                            | 2025-07-10  | 2025-07-11  |
| Table-driven tests for task_logger                          | context   | ✅ Done    | backend     | added pytest table-driven tests                        | 2025-07-10  | 2025-07-11  |
| Create backend folder structure                             | context   | ✅ Done    | backend     | added delivery/usecase/repository directories          | 2025-07-10  | 2025-07-11  |
| Create backend requirements file                            | context   | ✅ Done    | backend     | added requirements.txt and docs                        | 2025-07-10  | 2025-07-11  |
| ParseAndFilterXLS()                                         | usecase   | ✅ Done    | backend     | implemented parser in backend/repository/xls_parser.py | 2025-07-10  | 2025-07-11  |
| /process endpoint                                           | delivery  | ✅ Done    | backend     | implemented FastAPI route                              | 2025-07-10  | 2025-07-11  |
| Fix root AGENT Codex Rule bullet                            | docs      | ✅ Done    | backend     | completed bullet text and newline                      | 2025-07-11  | 2025-07-11  |
| Add openpyxl requirement                                    | context   | ✅ Done    | backend     | added openpyxl dependency and CI install step          | 2025-07-11  | 2025-07-11  |
| Prefix subtasks in appendTaskLog                            | context   | ✅ Done    | frontend    | ts logger with parentTaskName                          | 2025-07-11  | 2025-07-11  |
| Upload XLS - UploadBox                                      | ui        | ✅ Done    | frontend    | initial implementation                                 | 2025-07-11  | 2025-07-11  |
| Update frontend task logger                                 | context   | ✅ Done    | frontend    | switched to codex_task_tracker.md                      | 2025-07-11  | 2025-07-11  |
| Add jest-environment-jsdom                                  | context   | ✅ Done    | frontend    | added dev dependency                                   | 2025-07-11  | 2025-07-11  |
| Mode/Category Toggle - ModeSelector                         | ui        | ✅ Done    | frontend    | implemented ModeSelector with tests                    | 2025-07-11  | 2025-07-11  |
| Parse XLS Hook - useProcessXLS()                            | hooks     | ✅ Done    | frontend    | implemented useProcessXLS and tests                    | 2025-07-11  | 2025-07-11  |
| Fix safer-buffer dependency for npm tests                   | context   | ✅ Done    | frontend    | added safer-buffer dependency                          | 2025-07-11  | 2025-07-11  |
| Integration Test – UploadBox + ModeSelector + useProcessXLS | ui        | ✅ Done    | frontend    | integration test added                                 | 2025-07-11  | 2025-07-11  |
| Document FlightRow structure for editor UI                  | docs      | ✅ Done    | frontend    | added J/C and Y/C docs                                 | 2025-07-11  | 2025-07-11  |
| Fix editable field definition in FlightRow TECH_SPEC        | docs      | ✅ Done    | frontend    | clarify editable j/y fields                            | 2025-07-11  | 2025-07-11  |
| Rewrite duplicates in updateTaskTracker                     | context   | ✅ Done    | frontend    | rewrite duplicate rows and add tests                   | 2025-07-11  | 2025-07-11  |
| Extend FlightRow with seat classes                          | shared    | ✅ Done    | frontend    | add j_class and y_class fields; update tests           | 2025-07-12  | 2025-07-12  |
| Table Renderer – FlightTable                                | ui        | ✅ Done    | frontend    | implement table component                              | 2025-07-12  | 2025-07-12  |
| Seat Class Validation - FlightTable                         | ui        | ✅ Done    | frontend    | j/y class validation 0-99 with error state             | 2025-07-12  | 2025-07-12  |
| IPC Bridge Documentation                                    | docs      | ✅ Done    | frontend    | PRD + TECH_SPEC for Python subprocess bridge           | 2025-07-12  | 2025-07-12  |
| Update useProcessXLS types                                  | hooks     | ✅ Done    | frontend    | update hook to use Mode and Category types             | 2025-07-12  | 2025-07-12  |
| Add runtime validation to useProcessXLS                     | hooks     | ✅ Done    | frontend    | runtime checks for Mode/Category enums                 | 2025-07-12  | 2025-07-12  |
| Normalize backlog cleanup hyphen                            | context   | ✅ Done    | shared      | handle hyphen names in cleanup                         | 2025-07-12  | 2025-07-12  |
| Document environment variables (.env.sample)                | docs      | ✅ Done    | frontend    | added env sample and README steps                      | 2025-07-12  | 2025-07-12  |
| Hook – usePythonSubprocess                                  | hooks     | ✅ Done    | frontend    | spawn Python subprocess with typed args                | 2025-07-12  | 2025-07-12  |
