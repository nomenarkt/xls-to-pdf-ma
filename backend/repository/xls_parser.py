from __future__ import annotations

from datetime import date, timedelta
from typing import BinaryIO

import pandas as pd

REQUIRED_COLUMNS = ["Num Vol", "Départ", "Arrivée", "Imma", "SD LOC", "SA LOC"]


def parse_and_filter_xls(
    file_stream: BinaryIO,
    mode: str,
    today: date,
) -> list[dict]:
    """Load XLS stream and return rows matching the target date."""
    df = pd.read_excel(file_stream)

    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Missing column: {missing[0]}")

    if mode == "commandes":
        target = today + timedelta(days=1)
    elif mode == "precommandes":
        target = today + timedelta(days=2)
    else:
        raise ValueError("Invalid mode")

    df["SD LOC"] = pd.to_datetime(df["SD LOC"], errors="coerce")
    df["SA LOC"] = pd.to_datetime(df["SA LOC"], errors="coerce")

    filtered = df[df["SD LOC"].dt.date == target]

    result = []
    for _, row in filtered.iterrows():
        result.append(
            {
                "num_vol": row["Num Vol"],
                "depart": row["Départ"],
                "arrivee": row["Arrivée"],
                "imma": row["Imma"],
                "sd_loc": row["SD LOC"],
                "sa_loc": row["SA LOC"],
            }
        )
    return result
