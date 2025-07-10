# 🛠 Technical Specification: XLS to Editable PDF App

## 🏗️ Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React, Tailwind CSS      |
| Backend    | FastAPI (Python)         |
| XLS Parser | `pandas`, `openpyxl`     |
| PDF Output | `reportlab` (AcroForm) or `pdfkit` |
| Date Logic | `datetime`, `pytz`       |

---

## 📂 Backend Structure

```
backend/
├── main.py
├── parser.py
├── pdf_writer.py
└── requirements.txt
```

---

## 🔎 XLS Parsing Rules

### ✈️ Prestations à Bord: Flight Pairing

```python
def group_flight_pairs(df):
    groups = []
    used = set()

    for i, row in df.iterrows():
        if i in used:
            continue
        r1 = row
        r2 = df[
            (df["Départ"] == r1["Arrivée"]) &
            (df["Arrivée"] == r1["Départ"]) &
            (df.index > i)
        ]
        if not r2.empty:
            groups.append((r1, r2.iloc[0]))
            used.add(i)
            used.add(r2.index[0])
        else:
            groups.append((r1, None))
            used.add(i)
    return groups
```

---

### 🍽️ Salon: Mvt Calculation

```python
def get_mvt(sd_loc):
    time = pd.to_datetime(sd_loc).time()
    return "BRUNCH" if time >= time(3, 0) and time <= time(9, 30) else "LUNCH"
```

---

## 📆 Filtering Logic

```python
def filter_by_mode(df, mode):
    today = datetime.today().date()
    delta = 2 if "pré" in mode.lower() else 1
    target = today + timedelta(days=delta)
    df["DATE"] = pd.to_datetime(df["SD LOC"]).dt.date
    return df[df["DATE"] == target]
```

---

## 📤 API Endpoints

### `POST /upload`
- Accepts: `.xls` file
- Returns: structured JSON view by mode

### `POST /generate_pdf`
- Accepts: mode + processed flight data
- Returns: editable PDF

---

## 📄 Editable PDF Output — Enforcement

All fields must be **fully editable** in the final PDF:

| Field     | Editable in PDF |
|-----------|------------------|
| Date      | ✅ Yes           |
| Num Vol   | ✅ Yes           |
| Départ    | ✅ Yes           |
| Arrivée   | ✅ Yes           |
| Imma      | ✅ Yes           |
| SD LOC    | ✅ Yes           |
| SA LOC    | ✅ Yes           |
| J/C       | ✅ Yes           |
| Y/C       | ✅ Yes           |
| Nbre      | ✅ Yes           |
| Mvt       | ✅ Yes           |

> 🔒 **Enforcement**: Generated PDFs must match the interactive behavior and layout of the provided examples:
>
> - `Pré-commandes - Prestations à bord.pdf`
> - `Pré-commandes - Salon.pdf`

---

## 🔐 Security / Offline Mode

- Local-only execution
- No persistent storage
- In-memory processing only
