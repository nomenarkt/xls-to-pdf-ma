from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class FlightRow(BaseModel):
    """Structured flight data returned after XLS parsing."""

    num_vol: str
    depart: str
    arrivee: str
    imma: str
    sd_loc: datetime
    sa_loc: datetime
    jc: int
    yc: int
