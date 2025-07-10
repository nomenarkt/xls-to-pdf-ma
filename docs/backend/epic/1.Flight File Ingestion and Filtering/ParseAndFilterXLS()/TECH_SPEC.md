# 📄 TECH\_SPEC – Feature: `ParseAndFilterXLS()`

---

## 🧭 Function Signature

```python
def parse_and_filter_xls(
    file_stream: BinaryIO,
    mode: str,
    today: date
) -> list[dict]:
    ...
```

---

## 🔍 Logic Breakdown

1. **Load `.xls` into DataFrame**

   ```python
   df = pd.read_excel(file_stream)
   ```

2. **Validate required columns**

   * `Num Vol`, `Départ`, `Arrivée`, `Imma`, `SD LOC`, `SA LOC`
   * Raise `ValueError` if any missing

3. **Compute target date**

   ```python
   if mode == "commandes":
       target = today + timedelta(days=1)
   elif mode == "precommandes":
       target = today + timedelta(days=2)
   else:
       raise ValueError("Invalid mode")
   ```

4. **Normalize date columns**

   ```python
   df['SD LOC'] = pd.to_datetime(df['SD LOC'], errors='coerce')
   df['SA LOC'] = pd.to_datetime(df['SA LOC'], errors='coerce')
   ```

5. **Filter by `SD LOC.date()`**

   ```python
   filtered = df[df['SD LOC'].dt.date == target]
   ```

6. **Return structured list**

   ```python
   result = []
   for _, row in filtered.iterrows():
       result.append({
           "num_vol": row["Num Vol"],
           "depart": row["Départ"],
           "arrivee": row["Arrivée"],
           "imma": row["Imma"],
           "sd_loc": row["SD LOC"],
           "sa_loc": row["SA LOC"]
       })
   return result
   ```

---

## 🧪 Unit Test Targets

| Test                          | Example File        | Outcome                                        |
| ----------------------------- | ------------------- | ---------------------------------------------- |
| Valid input, `"commandes"`    | Sample from July 10 | Returns rows for July 11                       |
| Valid input, `"precommandes"` | Sample from July 10 | Returns rows for July 12                       |
| Missing `Num Vol` column      | Custom XLS          | Raises `ValueError("Missing column: Num Vol")` |

---

## 📂 File Location

```py
/backend/repository/xls_parser.py
```

---
