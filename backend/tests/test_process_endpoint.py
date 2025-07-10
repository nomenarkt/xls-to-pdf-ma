from __future__ import annotations

from datetime import date, datetime
from importlib import util
import sys
from io import BytesIO
from pathlib import Path
from typing import Any

import pandas as pd
import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

MODULE_PATH = Path(__file__).parents[1] / "delivery" / "api_routes.py"
ROOT = Path(__file__).parents[2]
sys.path.insert(0, str(ROOT))
spec = util.spec_from_file_location("api_routes", MODULE_PATH)
assert spec and spec.loader
api_routes: Any = util.module_from_spec(spec)
spec.loader.exec_module(api_routes)  # type: ignore[call-arg]
router = api_routes.router

app = FastAPI()
app.include_router(router)


def _make_xls(rows: list[dict]) -> BytesIO:
    df = pd.DataFrame(rows)
    buf = BytesIO()
    df.to_excel(buf, index=False, engine="openpyxl")
    buf.seek(0)
    return buf


@pytest.mark.asyncio
async def test_process_valid_commandes(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    today = date(2025, 7, 10)
    monkeypatch.setattr(
        api_routes,
        "date",
        type("D", (), {"today": staticmethod(lambda: today)}),
    )
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            "Imma": "F-1",
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 12, 0),
        }
    ]
    file_obj = _make_xls(rows)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/process",
            files={"file": ("test.xls", file_obj, "application/vnd.ms-excel")},
            data={"mode": "commandes", "category": "salon"},
        )
    assert response.status_code == 200
    assert response.json() == [
        {
            "num_vol": "AF1",
            "depart": "CDG",
            "arrivee": "JFK",
            "imma": "F-1",
            "sd_loc": "2025-07-11T08:00:00",
            "sa_loc": "2025-07-11T12:00:00",
        }
    ]


@pytest.mark.asyncio
async def test_invalid_file_type(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        api_routes,
        "date",
        type("D", (), {"today": staticmethod(lambda: date(2025, 7, 10))}),
    )
    file_obj = BytesIO(b"data")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/process",
            files={"file": ("bad.txt", file_obj, "text/plain")},
            data={"mode": "commandes", "category": "salon"},
        )
    assert response.status_code == 400
    assert "Invalid file type" in response.text


@pytest.mark.asyncio
async def test_missing_column_error(monkeypatch: pytest.MonkeyPatch) -> None:
    today = date(2025, 7, 10)
    monkeypatch.setattr(
        api_routes,
        "date",
        type("D", (), {"today": staticmethod(lambda: today)}),
    )
    rows = [
        {
            "Num Vol": "AF1",
            "Départ": "CDG",
            "Arrivée": "JFK",
            # Missing Imma
            "SD LOC": datetime(2025, 7, 11, 8, 0),
            "SA LOC": datetime(2025, 7, 11, 12, 0),
        }
    ]
    file_obj = _make_xls(rows)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/process",
            files={"file": ("test.xls", file_obj, "application/vnd.ms-excel")},
            data={"mode": "commandes", "category": "salon"},
        )
    assert response.status_code == 400
    assert "Missing column" in response.text


@pytest.mark.asyncio
async def test_precommandes_filters_j_plus_2(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    today = date(2025, 7, 10)
    monkeypatch.setattr(
        api_routes,
        "date",
        type("D", (), {"today": staticmethod(lambda: today)}),
    )
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
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/process",
            files={"file": ("test.xls", file_obj, "application/vnd.ms-excel")},
            data={"mode": "precommandes", "category": "salon"},
        )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["num_vol"] == "AF2"
