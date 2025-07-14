import argparse
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.usecase.process_flight_data import \
    process_flight_data  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Parse XLS and output JSON")
    parser.add_argument("--input", required=True, help="Path to .xls file")
    parser.add_argument("--output", required=True, help="Path to JSON output")
    parser.add_argument(
        "--mode",
        required=True,
        choices=["commandes", "precommandes"],
        help="Filtering mode",
    )
    parser.add_argument(
        "--category",
        help="Unused category filter",
        default="",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    with input_path.open("rb") as f:
        rows = process_flight_data(f, args.mode, date.today())

    payload = [r.model_dump(mode="json") for r in rows]
    output_path.write_text(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()
