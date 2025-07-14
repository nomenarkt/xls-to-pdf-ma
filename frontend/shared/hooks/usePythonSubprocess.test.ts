import { usePythonSubprocess } from "./usePythonSubprocess";
import { spawn } from "child_process";
import { Mode, Category } from "../../components/ModeSelector";
import { EventEmitter } from "events";

jest.mock("child_process");

const spawnMock = spawn as unknown as jest.Mock;

type Child = EventEmitter & {
  stdout: EventEmitter;
  stderr: EventEmitter;
  kill: jest.Mock;
};

function createChild(): Child {
  const child: Child = Object.assign(new EventEmitter(), {
    stdout: new EventEmitter(),
    stderr: new EventEmitter(),
    kill: jest.fn(),
  });
  return child;
}

describe("usePythonSubprocess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves with stdout, stderr, and exit code", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);

    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });

    child.stdout.emit("data", "ok");
    child.stderr.emit("data", "warn");
    child.emit("close", 0);

    await expect(promise).resolves.toEqual({
      stdout: "ok",
      stderr: "warn",
      exitCode: 0,
    });
  });

  it("resolves with exit code on failure", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });

    child.stderr.emit("data", "bad");
    child.emit("close", 2);

    await expect(promise).resolves.toEqual({
      stdout: "",
      stderr: "bad",
      exitCode: 2,
    });
  });

  it("rejects on timeout", async () => {
    jest.useFakeTimers();
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    jest.advanceTimersByTime(10000);
    await expect(promise).rejects.toThrow("timeout");
    expect(child.kill).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("validates mode and category", async () => {
    const run = usePythonSubprocess();
    await expect(
      run("in.xls", "out.json", {
        mode: "bad" as Mode,
        category: Category.SALON,
      }),
    ).rejects.toThrow("Invalid mode");
    await expect(
      run("in.xls", "out.json", {
        mode: Mode.COMMANDES,
        category: "bad" as Category,
      }),
    ).rejects.toThrow("Invalid category");
  });

  it("rejects when child emits error", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const run = usePythonSubprocess();
    const unhandled: unknown[] = [];
    const handler = (err: unknown) => {
      unhandled.push(err);
    };
    process.on("unhandledRejection", handler);
    const err = new Error("boom");
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    child.emit("error", err);
    await expect(promise).rejects.toBe(err);
    await new Promise(process.nextTick);
    expect(unhandled).toHaveLength(0);
    process.off("unhandledRejection", handler);
  });
});
