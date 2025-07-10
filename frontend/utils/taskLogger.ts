// utils/taskLogger.ts

import fs from 'fs';
import path from 'path';

const BASE_DIR = process.env.BASE_DIR || ''; // Optional override for tests
const TASK_LOG_FILE = 'frontend/task_log.md';
const BACKLOG_FILE = 'frontend/backlog.md';

export interface TaskLogEntry {
  taskName: string;
  layers: string;
  status: '✅ Done' | '⏳ In Progress' | '❌ Dropped';
  assignedTo: string;
  notes: string;
}

export async function appendTaskLog(entry: TaskLogEntry): Promise<void> {
  if (await hasDuplicateTask(entry.taskName)) {
    throw new Error(`Duplicate task detected: ${entry.taskName}`);
  }

  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const row = `| ${entry.taskName.padEnd(25)} | ${entry.layers.padEnd(25)} | ${entry.status.padEnd(13)} | ${entry.assignedTo.padEnd(11)} | ${entry.notes} |\n`;

  await fs.promises.appendFile(logPath, row);
  await cleanBacklog();
}

async function hasDuplicateTask(taskName: string): Promise<boolean> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  try {
    const content = await fs.promises.readFile(logPath, 'utf8');
    return content.includes(`| ${taskName} `);
  } catch {
    return false;
  }
}

async function cleanBacklog(): Promise<void> {
  const doneTasks = await parseDoneTasks();
  const backlogPath = path.join(BASE_DIR, BACKLOG_FILE);
  const content = await fs.promises.readFile(backlogPath, 'utf8');
  const lines = content.split('\n');
  const result: string[] = [];

  let skip = false;
  const headingRegex = /^.*Codex Task:/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (headingRegex.test(trimmed)) {
      const idx = trimmed.toLowerCase().indexOf('codex task:');
      const taskName = trimmed.slice(idx + 'codex task:'.length).trim();
      skip = doneTasks.has(taskName);
      if (skip) continue;
    }
    if (!skip) result.push(line);
  }

  const cleaned = result.join('\n') + (content.endsWith('\n') ? '\n' : '');
  if (cleaned !== content) {
    await fs.promises.writeFile(backlogPath, cleaned);
  }
}

async function parseDoneTasks(): Promise<Set<string>> {
  const logPath = path.join(BASE_DIR, TASK_LOG_FILE);
  const tasks = new Set<string>();

  try {
    const content = await fs.promises.readFile(logPath, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      const fields = line.split('|').map(f => f.trim());
      if (fields.length < 5) continue;
      if (fields[3] === '✅ Done') {
        tasks.add(fields[1]);
      }
    }
  } catch {
    // safe fallback
  }

  return tasks;
}

