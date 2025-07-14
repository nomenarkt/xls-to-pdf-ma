import { useProcessXLS } from "./useProcessXLS";
import { FlightRow } from "../types/flight";
import { Mode, Category } from "../../components/ModeSelector";
import { usePythonSubprocess } from "./usePythonSubprocess";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";

jest.mock("./usePythonSubprocess");
jest.mock("fs/promises");

const runMock = jest.fn();
const writeFileMock = writeFile as unknown as jest.Mock;

describe("useProcessXLS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePythonSubprocess as jest.Mock).mockReturnValue(runMock);
    writeFileMock.mockResolvedValue(undefined);
    jest.spyOn(Date, "now").mockReturnValue(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns data on success", async () => {
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
    runMock.mockResolvedValue(rows);
    const processXLS = useProcessXLS();
    const file = new File(["data"], "f.xls");
    const result = await processXLS(file, Mode.PRECOMMANDES, Category.SALON);
    const inputPath = path.join(tmpdir(), "input-1-f.xls");
    const outputPath = path.join(tmpdir(), "output-1.json");
    expect(result).toEqual(rows);
    expect(writeFileMock).toHaveBeenCalledWith(inputPath, expect.any(Buffer));
    expect(runMock).toHaveBeenCalledWith(inputPath, outputPath, {
      mode: Mode.PRECOMMANDES,
      category: Category.SALON,
    });
  });

  it("throws on subprocess error", async () => {
    const error = new Error("bad");
    runMock.mockRejectedValue(error);
    const processXLS = useProcessXLS();
    await expect(
      processXLS(new File([], "f.xls"), Mode.PRECOMMANDES, Category.SALON),
    ).rejects.toBe(error);
  });

  it("validates mode", async () => {
    const processXLS = useProcessXLS();
    await expect(
      processXLS(new File([], "f.xls"), "bad" as Mode, Category.SALON),
    ).rejects.toThrow("Invalid mode");
    expect(runMock).not.toHaveBeenCalled();
  });

  it("validates category", async () => {
    const processXLS = useProcessXLS();
    await expect(
      processXLS(new File([], "f.xls"), Mode.PRECOMMANDES, "bad" as Category),
    ).rejects.toThrow("Invalid category");
    expect(runMock).not.toHaveBeenCalled();
  });
});
