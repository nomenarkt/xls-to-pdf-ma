from io import BytesIO

import pytest
from openpyxl import Workbook

from .xls_helper import assert_true_xls


def test_assert_true_xls_rejects_xlsx() -> None:
    wb = Workbook()
    ws = wb.active
    ws["A1"] = "test"
    buf = BytesIO()
    wb.save(buf)
    buf.seek(0)
    with pytest.raises(AssertionError):
        assert_true_xls(buf)
