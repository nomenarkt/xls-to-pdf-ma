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
  j_class: number;
  y_class: number;
}
```

## Editable Fields

Only `j_class` and `y_class` are editable in the browser. All other fields are read-only values parsed from the `.xls` source.

### Seat Class Rules

- Minimum value: **0**
- Maximum value: **99**
- Step: **1** (whole numbers only)
- Non-numeric input is blocked.
- Values outside the allowed range or empty trigger a validation error.

## Column Mapping

| Interface Field | Table Heading | Editable |
| --------------- | ------------ | -------- |
| `num_vol`       | Num Vol      | No       |
| `depart`        | Départ       | No       |
| `arrivee`       | Arrivée      | No       |
| `imma`          | Imma         | No       |
| `sd_loc`        | SD LOC       | No       |
| `sa_loc`        | SA LOC       | No       |
| `j_class`       | J/C          | Yes      |
| `y_class`       | Y/C          | Yes      |

When new fields are introduced by the backend, extend the interface and table accordingly. Optional fields should use `?` in the TypeScript definition.
