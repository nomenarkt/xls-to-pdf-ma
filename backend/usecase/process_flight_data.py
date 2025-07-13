from __future__ import annotations

from datetime import date
from typing import BinaryIO

from backend.domain import FlightRow
from backend.repository.xls_parser import parse_and_filter_xls


def process_flight_data(
    file_stream: BinaryIO,
    mode: str,
    today: date,
) -> list[FlightRow]:
    """Delegate XLS parsing and filtering to repository layer."""
    return parse_and_filter_xls(file_stream, mode, today)
