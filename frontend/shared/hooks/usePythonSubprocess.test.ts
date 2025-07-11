import { usePythonSubprocess } from "./usePythonSubprocess";
import { spawn } from "child_process";
import { readFile } from "fs/promises";
import { Mode, Category } from "../../components/ModeSelector";
import { EventEmitter } from "events";
import { FlightRow } from "../types/flight";

jest.mock("child_process");
jest.mock("fs/promises");

const spawnMock = spawn as unknown as jest.Mock;
const readFileMock = readFile as unknown as jest.Mock;

type Child = EventEmitter & { stderr: EventEmitter; kill: jest.Mock };

function createChild(): Child {
  const child: Child = Object.assign(new EventEmitter(), {
    stderr: new EventEmitter(),
    kill: jest.fn(),
  });
  return child;
}

describe("usePythonSubprocess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns parsed rows on success", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const rows: FlightRow[] = [
      {
        num_vol: "AF1",
        depart: "CDG",
        arrivee: "LHR",
        imma: "A320",
        sd_loc: "A",
        sa_loc: "B",
        j_class: 0,
        y_class: 0,
      },
    ];
    readFileMock.mockResolvedValue(JSON.stringify(rows));

    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });

    child.emit("close", 0);

    await expect(promise).resolves.toEqual(rows);
    expect(spawnMock).toHaveBeenCalledWith("python", [
      "main.py",
      "--input",
      "in.xls",
      "--output",
      "out.json",
      "--mode",
      "commandes",
      "--category",
      "salon",
    ]);
  });

  it("rejects with stderr on failure", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    child.stderr.emit("data", "bad");
    child.emit("close", 1);
    await expect(promise).rejects.toThrow(
      "Python subprocess failed to parse XLS: bad: exit code 1",
    );
  });

  it("rejects on invalid JSON", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    readFileMock.mockResolvedValue("not json");
    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    child.emit("close", 0);
    await expect(promise).rejects.toThrow(
      "Python subprocess failed to parse XLS: Invalid JSON output from Python process: exit code 0",
    );
  });

  it("uses stderr when JSON parse fails", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    readFileMock.mockResolvedValue("not json");
    const run = usePythonSubprocess();
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    child.stderr.emit("data", "parse error");
    child.emit("close", 0);
    await expect(promise).rejects.toThrow(
      "Python subprocess failed to parse XLS: parse error: exit code 0",
    );
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

  it("rejects when child emits error without unhandled rejection", async () => {
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

  it("rejects when child closes with a signal", async () => {
    const child = createChild();
    spawnMock.mockReturnValue(child);
    const run = usePythonSubprocess();
    const unhandled: unknown[] = [];
    const handler = (err: unknown) => {
      unhandled.push(err);
    };
    process.on("unhandledRejection", handler);
    const promise = run("in.xls", "out.json", {
      mode: Mode.COMMANDES,
      category: Category.SALON,
    });
    child.emit("close", null, "SIGTERM");
    await expect(promise).rejects.toThrow(
      "Python subprocess failed to parse XLS: exit code null",
    );
    await new Promise(process.nextTick);
    expect(unhandled).toHaveLength(0);
    process.off("unhandledRejection", handler);
  });
});
