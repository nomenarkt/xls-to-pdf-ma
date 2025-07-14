from io import BytesIO

XLS_HEADER = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"


def assert_true_xls(file_obj: BytesIO) -> None:
    """Assert that the BytesIO buffer represents a true `.xls` file."""
    start = file_obj.getvalue()[:8]
    if start.startswith(b"PK\x03\x04"):
        raise AssertionError("File appears to be .xlsx; expected .xls")
    assert start == XLS_HEADER, "Invalid XLS file header"
