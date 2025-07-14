from __future__ import annotations

import json
import subprocess
from datetime import date, datetime, timedelta
from io import BytesIO
from pathlib import Path

import xlwt

from .xls_helper import assert_true_xls


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


def test_cli_main_writes_json(tmp_path: Path) -> None:
    today = date.today()
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            "Imma": "F-1",
            "SD LOC": datetime.combine(
                today + timedelta(days=1),
                datetime.min.time(),
            ),
            "SA LOC": datetime.combine(
                today + timedelta(days=1),
                datetime.min.time(),
            ),
        }
    ]
    buf = _make_xls(rows)
    input_path = tmp_path / "in.xls"
    input_path.write_bytes(buf.getvalue())
    output_path = tmp_path / "out.json"

    result = subprocess.run(
        [
            "python",
            "cli/main.py",
            "--input",
            str(input_path),
            "--output",
            str(output_path),
            "--mode",
            "commandes",
            "--category",
            "salon",
        ],
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr
    data = json.loads(output_path.read_text())
    assert data[0]["num_vol"] == "AF1"
