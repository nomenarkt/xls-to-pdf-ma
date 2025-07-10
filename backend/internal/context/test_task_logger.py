import importlib.util
import sys
from pathlib import Path
from typing import Any

import pytest

MODULE_PATH = Path(__file__).with_name("task_logger.py")
spec = importlib.util.spec_from_file_location("task_logger", MODULE_PATH)
assert spec and spec.loader
tl: Any = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
sys.modules[spec.name] = tl
spec.loader.exec_module(tl)  # type: ignore[call-arg]


def _setup_files(tmp_path: Path) -> None:
    (tmp_path / "backend").mkdir()
    backlog = tmp_path / "backend" / "backlog.md"
    backlog.write_text("### Codex Task: Sample\n")

    tracker = tmp_path / "codex_task_tracker.md"
    header = (
        "🗂️ Codex Task Tracker (SDLC Phase View | Status: To do, In Progress,"
        " Done | Context: backend/frontend/... | Notes: Technical and"
        " functional documentation)\n\n"
        "| **Task Title**                    | **Phase**                   |"  # noqa: E501
        " **Status** | **Context** | **Notes** | **Created** | **Updated** |\n"  # noqa: E501
        "| --------------------------------- | ---------------------------"  # noqa: E501
        " | ---------- | ----------- | --------------------------------------------------------------"  # noqa: E501
        " | ---------- | --------- |\n"  # noqa: E501
    )
    tracker.write_text(header)


@pytest.mark.parametrize(
    "scenario",
    [
        "append_new",
        "update_existing",
        "cleanup_done",
        "missing_files",
        "prefix_behavior",
    ],
)
def test_task_logger(tmp_path: Path, scenario: str) -> None:
    if scenario != "missing_files":
        _setup_files(tmp_path)
    tl.BASE_DIR = str(tmp_path)

    if scenario == "append_new":
        tl.update_task_tracker(
            "TaskA",
            "context",
            "⏳ In Progress",
            "Codex",
            "notes",
        )
        text = (tmp_path / "codex_task_tracker.md").read_text()
        assert "TaskA" in text and "⏳ In Progress" in text
        assert (tmp_path / "backend" / "backlog.md").read_text().strip() != ""

    elif scenario == "update_existing":
        tl.update_task_tracker(
            "Sample",
            "context",
            "⏳ In Progress",
            "Codex",
            "notes",
        )
        tl.update_task_tracker(
            "Sample",
            "context",
            "✅ Done",
            "Codex",
            "notes",
        )
        content = (tmp_path / "codex_task_tracker.md").read_text()
        assert content.count("Sample") == 1
        assert "✅ Done" in content
        assert (tmp_path / "backend" / "backlog.md").read_text().strip() == ""

    elif scenario == "cleanup_done":
        backlog = tmp_path / "backend" / "backlog.md"
        backlog.write_text(backlog.read_text() + "### Codex Task: Another\n")
        tl.update_task_tracker(
            "Another",
            "context",
            "✅ Done",
            "Codex",
            "notes",
        )
        assert "Another" not in backlog.read_text()

    elif scenario == "missing_files":
        tl.update_task_tracker(
            "Missing",
            "context",
            "⏳ In Progress",
            "Codex",
            "notes",
        )
        assert (tmp_path / "codex_task_tracker.md").exists()
        assert not (tmp_path / "backend" / "backlog.md").exists()

    elif scenario == "prefix_behavior":
        tl.append_subtask(
            "Parent",
            "Child",
            "context",
            "✅ Done",
            "Codex",
            "notes",
        )
        content = (tmp_path / "codex_task_tracker.md").read_text()
        assert "Parent – Child" in content

    tl.BASE_DIR = ""
