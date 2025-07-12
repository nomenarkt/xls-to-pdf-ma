# 📄 TECH_SPEC – IPC Bridge

---

## 1. 🔁 Launch Flow

1. `usePythonSubprocess()` receives `inputFilePath`, `outputFilePath`, `filters`
2. Node `spawn()` (or Tauri invoke) runs `python main.py` with CLI args:
   - `--input <inputFilePath>`
   - `--output <outputFilePath>`
   - `--mode <filters.mode>`
   - `--category <filters.category>`
3. Process stdout and stderr are streamed to the UI for status
4. On exit code `0`, frontend reads `outputFilePath` and parses JSON

---

## 2. 🧩 Hook Signature

```ts
interface Filters {
  mode: "precommandes" | "commandes";
  category: "salon" | "prestations";
}

async function usePythonSubprocess(
  inputFilePath: string,
  outputFilePath: string,
  filters: Filters,
): Promise<FlightRow[]>;
```

The hook resolves with the parsed `FlightRow[]` or throws an error if the subprocess fails.

---

## 3. 📥 Expected Input File

- `.xls` file copied to a temporary path accessible by Python
- Filters correspond to the selected mode and category

---

## 4. 📤 Expected Output

- `outputFilePath` contains JSON encoded flight rows as defined in `/shared/types/flight.ts`
- Example:

```json
[
  {
    "num_vol": "AF1234",
    "depart": "CDG",
    "arrivee": "JFK",
    "imma": "F-HZUA",
    "sd_loc": "2025-07-11T10:00:00",
    "sa_loc": "2025-07-11T13:00:00",
    "j_class": 0,
    "y_class": 0
  }
]
```

---

## 5. 🧪 Tests

- Subprocess resolves with parsed rows on success
- Errors captured from `stderr` reject the promise

---

Reference backlog entry: [IPC Bridge - usePythonSubprocess()](../../../frontend/backlog.md)
