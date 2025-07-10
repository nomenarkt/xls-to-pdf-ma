import fs from "fs";
import path from "path";
let appendTaskLog: typeof import("./taskLogger").appendTaskLog;

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
  ({ appendTaskLog } = require("./taskLogger"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  delete process.env.BASE_DIR;
});

test("prefixes task with parent name", async () => {
  await appendTaskLog(
    {
      taskName: "Child",
      layers: "context",
      status: "✅ Done",
      assignedTo: "Codex",
      notes: "notes",
    },
    "Parent",
  );
  const logPath = path.join(tmp, "frontend", "task_log.md");
  const content = fs.readFileSync(logPath, "utf8");
  expect(content).toContain("Parent – Child");
});

test("cleanBacklog removes prefixed tasks", async () => {
  const backlogPath = path.join(tmp, "frontend", "backlog.md");
  await appendTaskLog(
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
