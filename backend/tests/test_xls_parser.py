from __future__ import annotations

from datetime import date, datetime
from importlib import util
from io import BytesIO
from pathlib import Path
from typing import Any

import pandas as pd
import pytest

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
    assert result[0]["num_vol"] == "AF1"


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
    assert result[0]["num_vol"] == "AF2"


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
