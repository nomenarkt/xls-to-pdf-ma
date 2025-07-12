# 📘 PRD – Feature: IPC Bridge

## 🧩 Belongs To

🧱 Epic: Flight File Ingestion & Filtering
📂 Module: `usePythonSubprocess()`

---

## 🎯 Goal

Allow the frontend to launch the Python processing script as a local subprocess so the app can parse `.xls` files without an always-on server.

This feature originates from the backlog task **"IPC Bridge - usePythonSubprocess()"** documented in [`frontend/backlog.md`](../../../frontend/backlog.md).

---

## 👤 Users

- Frontend developers integrating the offline parsing workflow.

---

## 📥 Inputs

- **inputFilePath** – path to the uploaded `.xls`
- **outputFilePath** – path where the Python script writes JSON results
- **filters** – object with `mode` and `category`

---

## 📤 Expected Output

The Python process writes a JSON array of flight rows to `outputFilePath`. The frontend reads this file and updates state for table rendering.

---

## ✅ Acceptance Criteria

- [ ] Subprocess is spawned with all required arguments
- [ ] Success and error messages are captured
- [ ] JSON output is parsed and loaded into context
- [ ] Errors surface in the UI
