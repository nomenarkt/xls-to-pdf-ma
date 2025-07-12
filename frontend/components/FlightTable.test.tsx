/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { FlightTable } from "./FlightTable";
import { FlightRow } from "../shared/types/flight";

describe("FlightTable", () => {
  const baseRow: FlightRow = {
    num_vol: "AF1",
    depart: "CDG",
    arrivee: "LHR",
    imma: "A320",
    sd_loc: "A",
    sa_loc: "B",
    j_class: 1,
    y_class: 2,
  };

  test("renders all columns", () => {
    render(<FlightTable rows={[baseRow]} onChange={() => {}} />);
    expect(screen.getByText("AF1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });

  test("only j_class and y_class are editable", () => {
    render(<FlightTable rows={[baseRow]} onChange={() => {}} />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(2);
  });

  test("onChange called with updated row", async () => {
    const handle = jest.fn();
    render(<FlightTable rows={[baseRow]} onChange={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "5");
    expect(handle).toHaveBeenCalledWith({ ...baseRow, j_class: 5 });
  });

  test("handles undefined numeric fields", () => {
    const row = { ...baseRow, j_class: undefined as unknown as number };
    render(<FlightTable rows={[row]} onChange={() => {}} />);
    expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(0);
  });

  test("invalid input shows error and blocks change", async () => {
    const handle = jest.fn();
    render(<FlightTable rows={[baseRow]} onChange={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "abc");
    expect(handle).not.toHaveBeenCalled();
    expect(input).toHaveClass("border-red-500");
  });

  test("values outside range show error", async () => {
    render(<FlightTable rows={[baseRow]} onChange={() => {}} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "100");
    input.blur();
    expect(input).toHaveClass("border-red-500");
  });

  test("valid input clears error", async () => {
    const handle = jest.fn();
    render(<FlightTable rows={[baseRow]} onChange={handle} />);
    const input = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(input);
    await userEvent.type(input, "23");
    input.blur();
    expect(handle).toHaveBeenCalledWith({ ...baseRow, j_class: 23 });
    expect(input).not.toHaveClass("border-red-500");
  });
});
