// utils/taskLogger.ts

import fs from "fs";
import path from "path";

const BASE_DIR = process.env.BASE_DIR || ""; // Optional override for tests
const TASK_LOG_FILE = "codex_task_tracker.md";
const BACKLOG_FILE = "frontend/backlog.md";

export interface TaskLogEntry {
  taskName: string;
  layers: string;
  status: "✅ Done" | "⏳ In Progress" | "❌ Dropped";
  assignedTo: string;
  notes: string;
}

export async function updateTaskTracker(
  entry: TaskLogEntry,
  parentTaskName?: string,
): Promise<void> {
  let taskName = entry.taskName;
  if (parentTaskName && !taskName.startsWith(`${parentTaskName} – `)) {
    taskName = `${parentTaskName} – ${taskName}`;
  }

  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const now = new Date().toISOString().slice(0, 10);

  if (await hasDuplicateTask(taskName)) {
    const content = await fs.promises.readFile(logPath, "utf8").catch(() => "");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const fields = lines[i].split("|").map((f) => f.trim());
      if (fields.length < 7) continue;
      if (fields[1] === taskName) {
        const created = fields[6] || now;
        lines[i] =
          `| ${taskName.padEnd(25)} | ${entry.layers.padEnd(25)} | ${entry.status.padEnd(13)} | ${entry.assignedTo.padEnd(11)} | ${entry.notes} | ${created} | ${now} |`;
        break;
      }
    }
    await fs.promises.writeFile(logPath, lines.join("\n"));
  } else {
    const row = `| ${taskName.padEnd(25)} | ${entry.layers.padEnd(25)} | ${entry.status.padEnd(13)} | ${entry.assignedTo.padEnd(11)} | ${entry.notes} | ${now} | ${now} |\n`;
    await fs.promises.appendFile(logPath, row);
  }

  await cleanBacklog();
}

async function hasDuplicateTask(taskName: string): Promise<boolean> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  try {
    const content = await fs.promises.readFile(logPath, "utf8");
    return content.includes(`| ${taskName} `);
  } catch {
    return false;
  }
}

async function cleanBacklog(): Promise<void> {
  const doneTasks = await parseDoneTasks();
  const doneNormalized = new Set<string>();
  for (const name of doneTasks) {
    doneNormalized.add(name);
    if (name.includes("–")) {
      const trimmed = name.split("–", 1)[0].trim();
      if (trimmed) {
        doneNormalized.add(trimmed);
      }
    }
  }
  const backlogPath = path.join(BASE_DIR, BACKLOG_FILE);
  const content = await fs.promises.readFile(backlogPath, "utf8");
  const lines = content.split("\n");
  const result: string[] = [];

  let skip = false;
  const headingRegex = /^.*Codex Task:/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (headingRegex.test(trimmed)) {
      const idx = trimmed.toLowerCase().indexOf("codex task:");
      const taskName = trimmed.slice(idx + "codex task:".length).trim();
      skip = doneNormalized.has(taskName);
      if (skip) continue;
    }
    if (!skip) result.push(line);
  }

  const cleaned = result.join("\n") + (content.endsWith("\n") ? "\n" : "");
  if (cleaned !== content) {
    await fs.promises.writeFile(backlogPath, cleaned);
  }
}

async function parseDoneTasks(): Promise<Set<string>> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const tasks = new Set<string>();

  try {
    const content = await fs.promises.readFile(logPath, "utf8");
    const lines = content.split("\n");

    for (const line of lines) {
      const fields = line.split("|").map((f) => f.trim());
      if (fields.length < 7) continue;
      if (fields[3] === "✅ Done") {
        tasks.add(fields[1]);
      }
    }
  } catch {
    // safe fallback
  }

  return tasks;
}
