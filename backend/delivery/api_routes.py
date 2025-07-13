from __future__ import annotations

from datetime import date
from typing import Literal

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from backend.domain import FlightRow
from backend.usecase.process_flight_data import process_flight_data

router = APIRouter()


@router.post(
    "/process",
    response_model=list[FlightRow],
    summary="Filter and return structured flights",
    description=(
        "Parses XLS, filters by J+1 or J+2, "
        "returns formatted rows for pairing and layout."
    ),
)
async def process(
    file: UploadFile = File(...),
    mode: Literal["commandes", "precommandes"] = Form(...),
) -> list[FlightRow]:
    today = date.today()
    if not file.filename.endswith(".xls"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    try:
        rows = process_flight_data(file.file, mode, today)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return rows
