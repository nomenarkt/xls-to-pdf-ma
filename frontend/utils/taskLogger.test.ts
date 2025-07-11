import fs from "fs";
import path from "path";
let updateTaskTracker: typeof import("./taskLogger").updateTaskTracker;

const tmp = path.join(__dirname, "__tmp__");

beforeEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, "frontend"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "frontend", "backlog.md"),
    "### Codex Task: Sample\n",
  );
  process.env.BASE_DIR = tmp;
  jest.resetModules();
  ({ updateTaskTracker } = require("./taskLogger"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  delete process.env.BASE_DIR;
});

test("prefixes task with parent name", async () => {
  await updateTaskTracker(
    {
      taskName: "Child",
      layers: "context",
      status: "✅ Done",
      assignedTo: "Codex",
      notes: "notes",
    },
    "Parent",
  );
  const logPath = path.join(tmp, "codex_task_tracker.md");
  const content = fs.readFileSync(logPath, "utf8");
  expect(content).toContain("Parent – Child");
});

test("cleanBacklog removes prefixed tasks", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  await updateTaskTracker(
    {
      taskName: "Part1",
      layers: "context",
      status: "✅ Done",
      assignedTo: "Codex",
      notes: "",
    },
    "Sample",
  );
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("cleanBacklog removes tasks when tracker uses hyphen", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  fs.writeFileSync(backlogPath, "### Codex Task: Hyphen\n");
  await updateTaskTracker({
    taskName: "Hyphen-Subtask",
    layers: "context",
    status: "✅ Done",
    assignedTo: "Codex",
    notes: "",
  });
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("updates existing row when task is logged twice", async () => {
  const logPath = path.join(tmp, "codex_task_tracker.md");
  jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));
  await updateTaskTracker({
    taskName: "Dup",
    layers: "context",
    status: "⏳ In Progress",
    assignedTo: "Codex",
    notes: "first",
  });
  jest.setSystemTime(new Date("2025-01-02"));
  await updateTaskTracker({
    taskName: "Dup",
    layers: "context",
    status: "✅ Done",
    assignedTo: "Codex",
    notes: "second",
  });
  jest.useRealTimers();
  const lines = fs
    .readFileSync(logPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("Dup"));
  expect(lines).toHaveLength(1);
  const line = lines[0];
  expect(line).toContain("✅ Done");
  expect(line).toContain("2025-01-01");
  expect(line).toContain("2025-01-02");
});
