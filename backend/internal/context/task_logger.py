"""Utilities for logging Codex tasks in Python.

This mirrors the behavior of task_logger.go for Python tooling and tests."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

BASE_DIR = ""
CONTEXT = "backend"
BACKLOG_FILE = "backend/backlog.md"
TASK_LOG_FILE = "codex_task_tracker.md"


@dataclass
class TaskLogEntry:
    """Represents a single row in codex_task_tracker."""

    task_name: str
    phase: str
    status: str
    layer: str = "-"
    domain: str = "-"
    module: str = "-"
    epic: str = "-"
    feature: str = "-"
    description: str = ""
    test_status: str = "-"


def resolve_base_dir() -> Path:
    """Return directory containing backlog.md and codex_task_tracker.md."""
    if BASE_DIR:
        return Path(BASE_DIR)
    directory = Path.cwd()
    while True:
        if (directory / BACKLOG_FILE).exists():
            return directory
        if directory.parent == directory:
            break
        directory = directory.parent
    return directory


def has_duplicate_task(task_name: str) -> bool:
    """Return True if the task already exists in codex_task_tracker.md."""
    base = resolve_base_dir()
    fp = base / TASK_LOG_FILE
    if not fp.exists():
        return False
    with fp.open("r", encoding="utf-8") as file:
        for line in file:
            fields = [f.strip() for f in line.split("|")]
            if len(fields) < 14:
                continue
            if fields[1] == CONTEXT and fields[2] == task_name:
                return True
    return False


def update_task_tracker(
    entry: TaskLogEntry,
    parent_task_name: str | None = None,
) -> None:
    """Append or update a task entry in codex_task_tracker.md."""
    task_name = entry.task_name
    parent = parent_task_name or ""
    if parent and not task_name.startswith(f"{parent} – "):
        task_name = f"{parent} – {task_name}"
    entry.task_name = task_name

    base = resolve_base_dir()
    fp = base / TASK_LOG_FILE
    now = datetime.now().strftime("%Y-%m-%d")

    row_vals = [
        CONTEXT,
        entry.task_name,
        entry.phase,
        entry.status,
        entry.layer,
        entry.domain,
        entry.module,
        entry.epic,
        entry.feature,
        entry.description,
        entry.test_status,
    ]

    if has_duplicate_task(task_name):
        data = fp.read_text(encoding="utf-8").split("\n")
        for i, line in enumerate(data):
            fields = [f.strip() for f in line.split("|")]
            if len(fields) < 14:
                continue
            if fields[1] == CONTEXT and fields[2] == task_name:
                created = fields[12] if len(fields) > 13 else now
                data[i] = "| " + " | ".join(row_vals + [created, now]) + " |"
                break
        fp.write_text("\n".join(data), encoding="utf-8")
    else:
        row = "| " + " | ".join(row_vals + [now, now]) + " |\n"
        with fp.open("a", encoding="utf-8") as file:
            file.write(row)

    clean_backlog()


def append_subtask(
    parent_task: str,
    subtask_entry: TaskLogEntry,
) -> None:
    """Prefix subtask with parent task and delegate to update_task_tracker."""

    update_task_tracker(subtask_entry, parent_task)


def parse_done_tasks() -> set[str]:
    """Return the set of tasks marked ✅ Done."""
    base = resolve_base_dir()
    fp = base / TASK_LOG_FILE
    tasks: set[str] = set()
    if not fp.exists():
        return tasks
    with fp.open("r", encoding="utf-8") as file:
        for line in file:
            fields = [f.strip() for f in line.split("|")]
            if len(fields) < 14:
                continue
            name = fields[2]
            status = fields[4]
            if status == "✅ Done":
                tasks.add(name)
                trimmed = re.split(r"[\u2013-]", name, 1)[0].strip()
                if trimmed and trimmed != name:
                    tasks.add(trimmed)
    return tasks


def clean_backlog() -> None:
    """Remove completed tasks from backend/backlog.md."""
    base = resolve_base_dir()
    done = parse_done_tasks()

    done_normalized: set[str] = set()
    for name in done:
        done_normalized.add(name)
        trimmed = re.split(r"[\u2013-]", name, 1)[0].strip()
        if trimmed and trimmed != name:
            done_normalized.add(trimmed)

    backlog_path = base / BACKLOG_FILE
    if not backlog_path.exists():
        return

    backlog_content = backlog_path.read_text(encoding="utf-8")
    lines = backlog_content.split("\n")
    result: list[str] = []
    skip = False
    heading_rgx = re.compile(r"(?i)^.*Codex Task:")

    for line in lines:
        trimmed = line.strip()
        if (
            heading_rgx.match(trimmed)
            and not trimmed.startswith("<!--")
            and not trimmed.startswith("*")
            and not trimmed.startswith("-")
            and '"' not in trimmed
            and "'" not in trimmed
        ):
            idx = trimmed.lower().find("codex task:")
            task_name = trimmed[idx + len("codex task:") :].strip()  # noqa: E203,E501
            task_name = task_name.strip("[]")
            if task_name in done_normalized:
                skip = True
                continue
            skip = False
        if skip:
            continue
        result.append(line)

    cleaned = "\n".join(result)
    if backlog_content.endswith("\n") and not cleaned.endswith("\n"):
        cleaned += "\n"

    if cleaned != backlog_content:
        backlog_path.write_text(cleaned, encoding="utf-8")
