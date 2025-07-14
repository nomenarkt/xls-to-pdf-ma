/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import axios from "../api/axios";
import { useEditFlightRow } from "./useEditFlightRow";
import { FlightRow } from "../types/flight";

jest.mock("../api/axios");

const patchMock = axios.patch as unknown as jest.Mock;

describe("useEditFlightRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("patches row and returns data", async () => {
    const row: FlightRow = {
      num_vol: "AF1",
      depart: "",
      arrivee: "",
      imma: "",
      sd_loc: "",
      sa_loc: "",
      j_class: 1,
      y_class: 2,
    };
    patchMock.mockResolvedValue({ data: row });
    const { result } = renderHook(() => useEditFlightRow());
    await act(async () => {
      const res = await result.current.mutate(row);
      expect(res).toEqual(row);
    });
    expect(patchMock).toHaveBeenCalledWith("/process", {
      num_vol: "AF1",
      j_class: 1,
      y_class: 2,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error on failure", async () => {
    const err = new Error("bad");
    patchMock.mockRejectedValue(err);
    const { result } = renderHook(() => useEditFlightRow());
    await act(async () => {
      await expect(
        result.current.mutate({
          num_vol: "X",
          depart: "",
          arrivee: "",
          imma: "",
          sd_loc: "",
          sa_loc: "",
          j_class: 0,
          y_class: 0,
        }),
      ).rejects.toBe(err);
    });
    expect(result.current.error).toBe(err);
  });
});
