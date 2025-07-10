import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("task_logger.py")
spec = importlib.util.spec_from_file_location("task_logger", MODULE_PATH)
tl = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = tl
spec.loader.exec_module(tl)


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


def test_update_appends_and_cleans(tmp_path: Path) -> None:
    _setup_files(tmp_path)
    tl.BASE_DIR = str(tmp_path)

    tl.update_task_tracker(
        "Sample",
        "context",
        "⏳ In Progress",
        "Codex",
        "testing",
    )
    assert "Sample" in (tmp_path / "codex_task_tracker.md").read_text()
    assert "⏳ In Progress" in (tmp_path / "codex_task_tracker.md").read_text()
    # backlog still present
    assert (tmp_path / "backend" / "backlog.md").read_text().strip() != ""

    tl.update_task_tracker("Sample", "context", "✅ Done", "Codex", "testing")
    tracker_content = (tmp_path / "codex_task_tracker.md").read_text()
    assert "✅ Done" in tracker_content
    # backlog cleaned on Done
    assert (tmp_path / "backend" / "backlog.md").read_text().strip() == ""

    tl.BASE_DIR = ""


def test_append_subtask_prefix(tmp_path: Path) -> None:
    _setup_files(tmp_path)
    tl.BASE_DIR = str(tmp_path)

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
