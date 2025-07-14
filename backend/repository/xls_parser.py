from __future__ import annotations

from datetime import date, timedelta
from typing import BinaryIO

import pandas as pd

from backend.domain import FlightRow

# JC/YC maximums per immatriculation as defined in TECH_SPEC
CAPACITY_LIMITS: dict[str, tuple[int, int]] = {
    "5RMJF": (8, 62),
    "5REJC": (8, 56),
    "5REJH": (8, 64),
    "5REJK": (8, 64),
    "5REJB": (10, 62),
}

REQUIRED_COLUMNS = ["Num Vol", "Départ", "Arrivée", "Imma", "SD LOC", "SA LOC"]


def parse_and_filter_xls(
    file_stream: BinaryIO,
    mode: str,
    today: date,
) -> list[FlightRow]:
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

    filtered = df[df["SD LOC"].dt.date == target].copy()

    if filtered.empty:
        return []

    filtered["pair_key"] = filtered.apply(
        lambda r: tuple(sorted([r["Départ"], r["Arrivée"]])), axis=1
    )

    grouped = []
    for _, group in filtered.groupby("pair_key"):
        group_sorted = group.sort_values("SD LOC")
        grouped.append((group_sorted["SD LOC"].iloc[0], group_sorted))

    grouped.sort(key=lambda x: x[0])
    ordered_df = pd.concat([g[1] for g in grouped], ignore_index=True)

    result: list[FlightRow] = []
    for _, row in ordered_df.iterrows():
        jc = 0
        yc = 0
        if mode == "commandes" and row["Arrivée"] == "TNR":
            if row["Départ"] in {"SVB", "DIE", "NOS"}:
                jc += 2
                yc += 4
            else:
                jc += 2
                yc += 2

        jc_max, yc_max = CAPACITY_LIMITS.get(row["Imma"], (99, 99))
        jc = min(jc, jc_max)
        yc = min(yc, yc_max)

        result.append(
            FlightRow(
                num_vol=row["Num Vol"],
                depart=row["Départ"],
                arrivee=row["Arrivée"],
                imma=row["Imma"],
                sd_loc=row["SD LOC"],
                sa_loc=row["SA LOC"],
                jc=jc,
                yc=yc,
            )
        )
    return result
