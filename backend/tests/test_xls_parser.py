from __future__ import annotations

from datetime import date, datetime
from importlib import util
from io import BytesIO
from pathlib import Path
from typing import Any

import pandas as pd
import pytest

from backend.domain import FlightRow

MODULE_PATH = Path(__file__).parents[1] / "repository" / "xls_parser.py"
spec = util.spec_from_file_location("xls_parser", MODULE_PATH)
assert spec and spec.loader
xls_parser: Any = util.module_from_spec(spec)
spec.loader.exec_module(xls_parser)  # type: ignore[call-arg]
parse_and_filter_xls = xls_parser.parse_and_filter_xls


def _make_xls(rows: list[dict]) -> BytesIO:
    df = pd.DataFrame(rows)
    buf = BytesIO()
    df.to_excel(buf, index=False, engine="openpyxl")
    buf.seek(0)
    return buf


def test_parse_commandes() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            "Imma": "F-1",
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 12, 0),
        },
        {
            "Num Vol": "AF2",
            "Départ": "CDG",
            "Arrivée": "NRT",
            "Imma": "F-2",
            "SD LOC": datetime(2025, 7, 12, 8, 0),
            "SA LOC": datetime(2025, 7, 12, 12, 0),
        },
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "commandes", today)
    assert len(result) == 1
    assert isinstance(result[0], FlightRow)
    assert result[0].num_vol == "AF1"


def test_parse_precommandes() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            "Imma": "F-1",
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 12, 0),
        },
        {
            "Num Vol": "AF2",
            "Départ": "CDG",
            "Arrivée": "NRT",
            "Imma": "F-2",
            "SD LOC": datetime(2025, 7, 12, 8, 0),
            "SA LOC": datetime(2025, 7, 12, 12, 0),
        },
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "precommandes", today)
    assert len(result) == 1
    assert isinstance(result[0], FlightRow)
    assert result[0].num_vol == "AF2"


def test_missing_column_error() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            # Missing Imma column
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 12, 0),
        }
    ]
    file_obj = _make_xls(rows)
    with pytest.raises(ValueError, match="Missing column: Imma"):
        parse_and_filter_xls(file_obj, "commandes", today)


def test_pairing_sort_order() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "MD201",
            "Départ": "TNR",
            "Arrivée": "CDG",
            "Imma": "F-4",
            "SD LOC": datetime(2025, 7, 11, 20, 0),
            "SA LOC": datetime(2025, 7, 11, 23, 0),
        },
        {
            "Num Vol": "MD200",
            "Départ": "CDG",
            "Arrivée": "TNR",
            "Imma": "F-3",
            "SD LOC": datetime(2025, 7, 11, 10, 0),
            "SA LOC": datetime(2025, 7, 11, 13, 0),
        },
        {
            "Num Vol": "MD101",
            "Départ": "TLE",
            "Arrivée": "TNR",
            "Imma": "F-2",
            "SD LOC": datetime(2025, 7, 11, 16, 0),
            "SA LOC": datetime(2025, 7, 11, 18, 0),
        },
        {
            "Num Vol": "MD100",
            "Départ": "TNR",
            "Arrivée": "TLE",
            "Imma": "F-1",
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 9, 30),
        },
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "commandes", today)
    order = [r.num_vol for r in result]
    assert order == ["MD100", "MD101", "MD200", "MD201"]
