import { useProcessXLS } from "./useProcessXLS";
import axios from "../api/axios";
import { FlightRow } from "../types/flight";
import { Mode, Category } from "../../components/ModeSelector";

jest.mock("../api/axios");

const mockedPost = (axios as jest.Mocked<typeof axios>).post;

describe("useProcessXLS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    mockedPost.mockResolvedValue({ status: 200, data: rows });
    const processXLS = useProcessXLS();
    const result = await processXLS(
      new File([], "f.xls"),
      Mode.PRECOMMANDES,
      Category.SALON,
    );
    expect(result).toEqual(rows);
    expect(mockedPost).toHaveBeenCalledWith("/process", expect.any(FormData));
  });

  it("throws on http error", async () => {
    const error = new Error("bad");
    mockedPost.mockRejectedValue(error);
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
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("validates category", async () => {
    const processXLS = useProcessXLS();
    await expect(
      processXLS(new File([], "f.xls"), Mode.PRECOMMANDES, "bad" as Category),
    ).rejects.toThrow("Invalid category");
    expect(mockedPost).not.toHaveBeenCalled();
  });
});
