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
