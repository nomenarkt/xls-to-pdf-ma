from __future__ import annotations

from datetime import date, datetime
from importlib import util
from io import BytesIO
from pathlib import Path
from typing import Any

import pytest
import xlwt

from backend.domain import FlightRow

from .xls_helper import assert_true_xls

MODULE_PATH = Path(__file__).parents[1] / "repository" / "xls_parser.py"
spec = util.spec_from_file_location("xls_parser", MODULE_PATH)
assert spec and spec.loader
xls_parser: Any = util.module_from_spec(spec)
spec.loader.exec_module(xls_parser)  # type: ignore[call-arg]
parse_and_filter_xls = xls_parser.parse_and_filter_xls


def _make_xls(rows: list[dict]) -> BytesIO:
    workbook = xlwt.Workbook()
    sheet = workbook.add_sheet("Sheet1")
    if rows:
        headers = list(rows[0].keys())
        for col, header in enumerate(headers):
            sheet.write(0, col, header)
        date_style = xlwt.easyxf(num_format_str="YYYY-MM-DD HH:MM:SS")
        for row_index, row in enumerate(rows, 1):
            for col_index, header in enumerate(headers):
                value = row.get(header)
                if isinstance(value, datetime):
                    sheet.write(row_index, col_index, value, date_style)
                else:
                    sheet.write(row_index, col_index, value)
    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    assert_true_xls(buffer)
    return buffer


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
    assert result[0].jc == 0
    assert result[0].yc == 0


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
    assert result[0].jc == 0
    assert result[0].yc == 0


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
    jc_yc = [(r.num_vol, r.jc, r.yc) for r in result]
    assert jc_yc[1][1:] == (2, 2)  # MD101 return leg
    assert jc_yc[2][1:] == (2, 2)  # MD200 return leg
    assert jc_yc[0][1:] == (0, 0)
    assert jc_yc[3][1:] == (0, 0)


def test_return_leg_boost_special_airport() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "MD400",
            "Départ": "SVB",
            "Arrivée": "TNR",
            "Imma": "5REJK",
            "SD LOC": datetime(2025, 7, 11, 6, 0),
            "SA LOC": datetime(2025, 7, 11, 8, 0),
        }
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "commandes", today)
    assert len(result) == 1
    r = result[0]
    assert r.jc == 2
    assert r.yc == 4


def test_return_leg_boost_default_airport() -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "MD401",
            "Départ": "TLE",
            "Arrivée": "TNR",
            "Imma": "5REJK",
            "SD LOC": datetime(2025, 7, 11, 12, 0),
            "SA LOC": datetime(2025, 7, 11, 14, 0),
        }
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "commandes", today)
    assert len(result) == 1
    r = result[0]
    assert r.jc == 2
    assert r.yc == 2


@pytest.mark.parametrize(
    "imma,jc_max,yc_max",
    [
        ("5RMJF", 8, 62),
        ("5REJC", 8, 56),
        ("5REJH", 8, 64),
        ("5REJK", 8, 64),
        ("5REJB", 10, 62),
    ],
)
def test_jc_yc_limits(imma: str, jc_max: int, yc_max: int) -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "MD300",
            "Départ": "SVB",
            "Arrivée": "TNR",
            "Imma": imma,
            "SD LOC": datetime(2025, 7, 11, 6, 0),
            "SA LOC": datetime(2025, 7, 11, 8, 0),
        }
    ]
    file_obj = _make_xls(rows)
    result = parse_and_filter_xls(file_obj, "commandes", today)
    assert len(result) == 1
    r = result[0]
    assert r.jc == min(2, jc_max)
    assert r.yc == min(4, yc_max)
    assert r.jc <= jc_max and r.yc <= yc_max


def test_return_leg_clamped(monkeypatch: pytest.MonkeyPatch) -> None:
    today = date(2025, 7, 10)
    rows = [
        {
            "Num Vol": "MD500",
            "Départ": "SVB",
            "Arrivée": "TNR",
            "Imma": "5RMJF",
            "SD LOC": datetime(2025, 7, 11, 6, 0),
            "SA LOC": datetime(2025, 7, 11, 8, 0),
        }
    ]
    file_obj = _make_xls(rows)
    monkeypatch.setitem(xls_parser.CAPACITY_LIMITS, "5RMJF", (1, 1))
    result = parse_and_filter_xls(file_obj, "commandes", today)
    assert len(result) == 1
    r = result[0]
    assert r.jc == 1
    assert r.yc == 1
