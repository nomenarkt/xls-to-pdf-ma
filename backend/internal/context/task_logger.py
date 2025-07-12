"""Utilities for logging Codex tasks in Python.

This mirrors the behavior of task_logger.go for Python tooling and tests."""

from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path

BASE_DIR = ""
BACKLOG_FILE = "backend/backlog.md"
TASK_LOG_FILE = "codex_task_tracker.md"


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
    pattern = re.compile(r"\|\s*(.*?)\s*\|")
    with fp.open("r", encoding="utf-8") as file:
        for line in file:
            match = pattern.search(line)
            if match and match.group(1) == task_name:
                return True
    return False


def update_task_tracker(
    task_name: str,
    layers: str,
    status: str,
    assigned_to: str,
    notes: str,
    parent_task_name: str | None = None,
) -> None:
    """Append or update a task entry in codex_task_tracker.md."""
    parent = parent_task_name or ""
    if parent and not task_name.startswith(f"{parent} – "):
        task_name = f"{parent} – {task_name}"

    base = resolve_base_dir()
    fp = base / TASK_LOG_FILE
    now = datetime.now().strftime("%Y-%m-%d")

    if has_duplicate_task(task_name):
        data = fp.read_text(encoding="utf-8").split("\n")
        for i, line in enumerate(data):
            fields = [f.strip() for f in line.split("|")]
            if len(fields) < 5:
                continue
            name = fields[1]
            if name == task_name:
                created = now if len(fields) < 7 else fields[6]
                updated = now
                data[i] = (
                    f"| {task_name:<25} | {layers:<25} | {status:<13} | "
                    f"{assigned_to:<11} | {notes} | {created:<10} | "
                    f"{updated:<10} |"
                )
                break
        fp.write_text("\n".join(data), encoding="utf-8")
    else:
        row = (
            f"| {task_name:<25} | {layers:<25} | {status:<13} | "
            f"{assigned_to:<11} | {notes} | {now:<10} | {now:<10} |\n"
        )
        with fp.open("a", encoding="utf-8") as file:
            file.write(row)

    clean_backlog()


def append_subtask(
    parent_task: str,
    subtask: str,
    layers: str,
    status: str,
    assigned_to: str,
    notes: str,
) -> None:
    """Prefix subtask with parent task and delegate to update_task_tracker."""

    update_task_tracker(
        subtask,
        layers,
        status,
        assigned_to,
        notes,
        parent_task,
    )


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
            if len(fields) < 5:
                continue
            name = fields[1]
            status = fields[3]
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
