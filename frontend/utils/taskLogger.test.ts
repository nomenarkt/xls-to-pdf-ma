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
      phase: "context",
      status: "✅ Done",
      description: "notes",
    },
    "Parent",
  );
  const logPath = path.join(tmp, "codex_task_tracker.md");
  const content = fs.readFileSync(logPath, "utf8");
  expect(content).toContain("Parent > Child");
});

test("cleanBacklog removes prefixed tasks", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  await updateTaskTracker(
    {
      taskName: "Part1",
      phase: "context",
      status: "✅ Done",
      description: "",
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
    phase: "context",
    status: "✅ Done",
    description: "",
  });
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("cleanBacklog handles quoted backlog entries", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  fs.writeFileSync(backlogPath, "### Codex Task: `Quoted – Entry`\n");
  fs.writeFileSync(
    path.join(tmp, "codex_task_tracker.md"),
    `| frontend | Quoted - Entry | context | ✅ Done | - | - | - | - | - | - | - | 2025-01-01 | 2025-01-01 |\n`,
    { flag: "a" },
  );
  const { cleanBacklog } = require("./taskLogger");
  await cleanBacklog();
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("cleanBacklog detects numbered task headings", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  fs.writeFileSync(backlogPath, "### Task 2: Numbered\n");
  await updateTaskTracker({
    taskName: "Numbered",
    phase: "context",
    status: "✅ Done",
    description: "notes",
  });
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("cleanBacklog normalizes dash variants", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  fs.writeFileSync(backlogPath, "### Codex Task: `Dash – Test`\n");
  fs.writeFileSync(
    path.join(tmp, "codex_task_tracker.md"),
    `| frontend | Dash - Test | context | ✅ Done | - | - | - | - | - | - | - | 2025-01-01 | 2025-01-01 |\n`,
    { flag: "a" },
  );
  const { cleanBacklog } = require("./taskLogger");
  await cleanBacklog();
  const backlog = fs.readFileSync(backlogPath, "utf8");
  expect(backlog.trim()).toBe("");
});

test("updates existing row when task is logged twice", async () => {
  const logPath = path.join(tmp, "codex_task_tracker.md");
  jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));
  await updateTaskTracker({
    taskName: "Dup",
    phase: "context",
    status: "⏳ In Progress",
    description: "first",
  });
  jest.setSystemTime(new Date("2025-01-02"));
  await updateTaskTracker({
    taskName: "Dup",
    phase: "context",
    status: "✅ Done",
    description: "second",
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
