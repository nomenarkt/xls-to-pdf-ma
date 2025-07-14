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
        "| Context | Task Title | Phase | Status | Layer | Domain | Module |"
        " Epic | Feature | Description | Test Status | Created | Updated |\n"
        "| --- | --- | --- | --- | --- | --- | --- | --- | "
        "--- | --- | --- | --- | --- |\n"
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
        "hyphen_cleanup",
        "dash_normalization",
        "task_number_heading",
    ],
)
def test_task_logger(tmp_path: Path, scenario: str) -> None:
    if scenario != "missing_files":
        _setup_files(tmp_path)
    tl.BASE_DIR = str(tmp_path)

    if scenario == "append_new":
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="TaskA",
                phase="context",
                status="⏳ In Progress",
                description="notes",
            )
        )
        text = (tmp_path / "codex_task_tracker.md").read_text()
        assert "TaskA" in text and "⏳ In Progress" in text
        assert (tmp_path / "backend" / "backlog.md").read_text().strip() != ""

    elif scenario == "update_existing":
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Sample",
                phase="context",
                status="⏳ In Progress",
                description="notes",
            )
        )
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Sample",
                phase="context",
                status="✅ Done",
                description="notes",
            )
        )
        content = (tmp_path / "codex_task_tracker.md").read_text()
        assert content.count("Sample") == 1
        assert "✅ Done" in content
        assert (tmp_path / "backend" / "backlog.md").read_text().strip() == ""

    elif scenario == "cleanup_done":
        backlog = tmp_path / "backend" / "backlog.md"
        backlog.write_text(backlog.read_text() + "### Codex Task: Another\n")
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Another",
                phase="context",
                status="✅ Done",
                description="notes",
            )
        )
        assert "Another" not in backlog.read_text()

    elif scenario == "missing_files":
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Missing",
                phase="context",
                status="⏳ In Progress",
                description="notes",
            )
        )
        assert (tmp_path / "codex_task_tracker.md").exists()
        assert not (tmp_path / "backend" / "backlog.md").exists()

    elif scenario == "prefix_behavior":
        tl.append_subtask(
            "Parent",
            tl.TaskLogEntry(
                task_name="Child",
                phase="context",
                status="✅ Done",
                description="notes",
            ),
        )
        content = (tmp_path / "codex_task_tracker.md").read_text()
        assert "Parent > Child" in content

    elif scenario == "hyphen_cleanup":
        backlog = tmp_path / "backend" / "backlog.md"
        backlog.write_text("### Codex Task: Hyphen\n")
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Hyphen-Child",
                phase="context",
                status="✅ Done",
                description="notes",
            )
        )
        assert backlog.read_text().strip() == ""

    elif scenario == "dash_normalization":
        backlog = tmp_path / "backend" / "backlog.md"
        backlog.write_text("### Codex Task: `Dash – Test`\n")
        with (tmp_path / "codex_task_tracker.md").open("a") as f:
            row = (
                "| backend | Dash - Test | context | ✅ Done | - | - | - | -"
                " | - | - | 2025-01-01 | 2025-01-01 |\n"
            )
            f.write(row)
        tl.clean_backlog()
        assert backlog.read_text().strip() == ""

    elif scenario == "task_number_heading":
        backlog = tmp_path / "backend" / "backlog.md"
        backlog.write_text("### Task 3: Numbered\n")
        tl.update_task_tracker(
            tl.TaskLogEntry(
                task_name="Numbered",
                phase="context",
                status="✅ Done",
                description="notes",
            )
        )
        assert backlog.read_text().strip() == ""

    tl.BASE_DIR = ""
