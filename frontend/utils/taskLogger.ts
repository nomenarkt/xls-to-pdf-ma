// utils/taskLogger.ts

import fs from "fs";
import path from "path";

const BASE_DIR = process.env.BASE_DIR || ""; // Optional override for tests
const TASK_LOG_FILE = "codex_task_tracker.md";
const BACKLOG_FILE = "frontend/backlog.md";
const CONTEXT = "frontend";

function normalizeDashes(text: string): string {
  return text.replace(/[\u2013\u2014]/g, "-");
}

export function extractTaskTitle(line: string): string | null {
  const match = line.match(/codex task:\s*`?([^`]+)`?/i);
  return match ? normalizeDashes(match[1].trim()) : null;
}

export interface TaskLogEntry {
  taskName: string;
  phase: string;
  status: "✅ Done" | "⏳ In Progress" | "❌ Dropped";
  layer?: string;
  domain?: string;
  module?: string;
  epic?: string;
  feature?: string;
  description?: string;
  testStatus?: string;
}

export async function updateTaskTracker(
  entry: TaskLogEntry,
  parentTaskName?: string,
): Promise<void> {
  let taskName = entry.taskName;
  if (parentTaskName && !taskName.startsWith(`${parentTaskName} > `)) {
    taskName = `${parentTaskName} > ${taskName}`;
  }
  entry.taskName = taskName;

  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const now = new Date().toISOString().slice(0, 10);

  const rowValues = [
    CONTEXT,
    entry.taskName,
    entry.phase,
    entry.status,
    entry.layer ?? "-",
    entry.domain ?? "-",
    entry.module ?? "-",
    entry.epic ?? "-",
    entry.feature ?? "-",
    entry.description ?? "",
    entry.testStatus ?? "-",
  ];

  if (await hasDuplicateTask(taskName)) {
    const content = await fs.promises.readFile(logPath, "utf8").catch(() => "");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const fields = lines[i].split("|").map((f) => f.trim());
      if (fields.length < 14) continue;
      if (fields[1] === CONTEXT && fields[2] === taskName) {
        const created = fields[12] || now;
        lines[i] = `| ${[...rowValues, created, now].join(" | ")} |`;
        break;
      }
    }
    await fs.promises.writeFile(logPath, lines.join("\n"));
  } else {
    const row = `| ${[...rowValues, now, now].join(" | ")} |\n`;
    await fs.promises.appendFile(logPath, row);
  }

  await cleanBacklog();
}

async function hasDuplicateTask(taskName: string): Promise<boolean> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  try {
    const content = await fs.promises.readFile(logPath, "utf8");
    return content.split("\n").some((line) => {
      const fields = line.split("|").map((f) => f.trim());
      return (
        fields.length >= 14 && fields[1] === CONTEXT && fields[2] === taskName
      );
    });
  } catch {
    return false;
  }
}

export async function cleanBacklog(): Promise<void> {
  const doneTasks = await parseDoneTasks();
  const doneNormalized = new Set<string>();
  for (const name of doneTasks) {
    const normalized = normalizeDashes(name);
    doneNormalized.add(normalized);
    let base = normalized;
    if (normalized.includes('>')) {
      base = normalized.split('>', 1)[0].trim();
      doneNormalized.add(base);
    }
    const trimmed = base.split('-', 1)[0].trim();
    if (trimmed && trimmed !== base) {
      doneNormalized.add(trimmed);
    }
  }
  const backlogPath = path.join(BASE_DIR, BACKLOG_FILE);
  const content = await fs.promises.readFile(backlogPath, "utf8");
  const lines = content.split("\n");
  const result: string[] = [];

  let skip = false;
  for (const line of lines) {
    const title = extractTaskTitle(line);
    if (title) {
      skip = doneNormalized.has(title);
      if (skip) {
        continue;
      }
    }
    if (!skip) {
      result.push(line);
    }
  }

  const cleaned = result.join("\n") + (content.endsWith("\n") ? "\n" : "");
  if (cleaned !== content) {
    await fs.promises.writeFile(backlogPath, cleaned);
  }
}

export async function parseDoneTasks(): Promise<Set<string>> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const tasks = new Set<string>();

  try {
    const content = await fs.promises.readFile(logPath, "utf8");
    const lines = content.split("\n");

    for (const line of lines) {
      const fields = line.split("|").map((f) => f.trim());
      if (fields.length < 14) continue;
      if (fields[4] === "✅ Done") {
        const name = normalizeDashes(fields[2].trim());
        tasks.add(name);
        let base = name;
        if (name.includes('>')) {
          base = name.split('>', 1)[0].trim();
          tasks.add(base);
        }
        const trimmed = base.split('-', 1)[0].trim();
        if (trimmed && trimmed !== base) {
          tasks.add(trimmed);
        }
      }
    }
  } catch {
    // safe fallback
  }

  return tasks;
}
