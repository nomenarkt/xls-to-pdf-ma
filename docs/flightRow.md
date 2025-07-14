# FlightRow Reference

This document describes how the `FlightRow` interface maps to the editable table used in the editor UI.
It clarifies which fields are editable and defines the validation rules for seat-class inputs.

## Interface

```ts
export interface FlightRow {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
  jc: number;
  yc: number;
}
```

## Editable Fields

Only `jc` and `yc` are editable in the browser. All other fields are read-only values parsed from the `.xls` source.

### Seat Class Rules

- Minimum value: **0**
- Maximum value: **99**
- Step: **1** (whole numbers only)
- Non-numeric input is blocked.
- Values outside the allowed range or empty trigger a validation error.

## Column Mapping

| Interface Field | Table Heading | Editable |
| --------------- | ------------- | -------- |
| `num_vol`       | Num Vol       | No       |
| `depart`        | Départ        | No       |
| `arrivee`       | Arrivée       | No       |
| `imma`          | Imma          | No       |
| `sd_loc`        | SD LOC        | No       |
| `sa_loc`        | SA LOC        | No       |
| `jc`            | J/C           | Yes      |
| `yc`            | Y/C           | Yes      |

When new fields are introduced by the backend, extend the interface and table accordingly. Optional fields should use `?` in the TypeScript definition.
