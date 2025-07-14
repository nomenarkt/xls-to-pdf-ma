/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { FlightTable } from "./FlightTable";
import { FlightRow, RowError } from "../shared/types/flight";
import { useEditFlightRow } from "../shared/hooks/useEditFlightRow";

jest.mock("../shared/hooks/useEditFlightRow");

const mutateMock = jest.fn();
(useEditFlightRow as jest.Mock).mockReturnValue({
  mutate: mutateMock,
  isLoading: false,
  error: null,
});

describe("FlightTable", () => {
  const baseRow: FlightRow = {
    num_vol: "AF1",
    depart: "CDG",
    arrivee: "LHR",
    imma: "A320",
    sd_loc: "A",
    sa_loc: "B",
    jc: 1,
    yc: 2,
  };

  test("renders all columns", () => {
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={() => {}} />);
    expect(screen.getByText("AF1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });

  test("only jc and yc are editable", () => {
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={() => {}} />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(2);
  });

  test("onEdit called after PATCH", async () => {
    const handle = jest.fn();
    mutateMock.mockResolvedValue({ ...baseRow, jc: 5 });
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "5");
    expect(mutateMock).toHaveBeenCalledWith({
      ...baseRow,
      jc: 5,
    });
    expect(handle).toHaveBeenCalledWith({ ...baseRow, jc: 5 });
  });

  test("handles undefined numeric fields", () => {
    const row = { ...baseRow, jc: undefined as unknown as number };
    render(<FlightTable data={[row]} errors={[]} onEdit={() => {}} />);
    expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(0);
  });

  test("invalid input shows error and blocks change", async () => {
    const handle = jest.fn();
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "abc");
    expect(handle).not.toHaveBeenCalled();
    expect(input).toHaveClass("border-red-500");
  });

  test("values outside range show error", async () => {
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={() => {}} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "100");
    input.blur();
    expect(input).toHaveClass("border-red-500");
  });

  test("valid input clears error", async () => {
    const handle = jest.fn();
    mutateMock.mockResolvedValue({ ...baseRow, jc: 23 });
    render(<FlightTable data={[baseRow]} errors={[]} onEdit={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "23");
    input.blur();
    expect(handle).toHaveBeenCalledWith({ ...baseRow, jc: 23 });
    expect(input).not.toHaveClass("border-red-500");
  });

  test("error rows get highlighted", () => {
    const errors: RowError[] = [{ num_vol: "AF1", message: "bad" }];
    render(<FlightTable data={[baseRow]} errors={errors} onEdit={() => {}} />);
    const row = screen.getByText("AF1").closest("tr");
    expect(row).toHaveClass("bg-red-50");
  });
});
