# 📄 TECH_SPEC – FlightRow Structure Documentation

This spec explains each field of `FlightRow` and how it maps to the editable table used in the editor UI.

---

## 1. Interface Reference

```ts
export interface FlightRow {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
  j_class: number;
  y_class: number;
}
```

`num_vol`, `depart`, `arrivee`, `imma`, `sd_loc`, and `sa_loc` are read‑only columns.
Only `j_class` and `y_class` are editable. These fields use `<input type="number">` with the following validation rules:

- `min` **0**
- `max` **99**
- `step` **1** (whole numbers only)

Typing letters or decimals is blocked. Values below `0`, above `99`, or empty trigger a red border and accessible error label. The table does not propagate changes until the value is corrected.

---

## 2. Column Mapping

| Interface Field | Table Heading | Editable (Browser UI) |
| --------------- | ------------- | --------------------- |
| `num_vol`       | Num Vol       | No                    |
| `depart`        | Départ        | No                    |
| `arrivee`       | Arrivée       | No                    |
| `imma`          | Imma          | No                    |
| `sd_loc`        | SD LOC        | No                    |
| `sa_loc`        | SA LOC        | No                    |
| `j_class`       | J/C           | Yes                   |
| `y_class`       | Y/C           | Yes                   |

Only `j_class` and `y_class` are editable in the browser UI. These fields appear as numeric inputs and default to `0` when a row is created or parsed. All other values are read-only and derived from the parsed `.xls` source.

---

## 3. Extending the Type

When the backend introduces new fields, extend the interface in `flight.ts` and update the table renderer. For optional fields, add `?` to the property. Example:

```ts
export interface FlightRow {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
  gate?: string; // new optional field
}
```

Add the new column heading to `FlightTable` and ensure default values are handled in state.
