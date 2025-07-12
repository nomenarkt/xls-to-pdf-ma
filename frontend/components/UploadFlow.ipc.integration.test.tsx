/** @jest-environment jsdom */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModeSelector, Mode, Category } from "./ModeSelector";
import { UploadBox } from "./UploadBox";
import { usePythonSubprocess } from "../shared/hooks/usePythonSubprocess";
import { FlightRow } from "../shared/types/flight";
import { FlightTable } from "./FlightTable";
import { spawn } from "child_process";
import { readFile } from "fs/promises";
import { EventEmitter } from "events";

jest.mock("child_process");
jest.mock("fs/promises");

const spawnMock = spawn as unknown as jest.Mock;
const readFileMock = readFile as unknown as jest.Mock;

function createChild() {
  const child: any = new EventEmitter();
  child.stderr = new EventEmitter();
  child.kill = jest.fn();
  return child;
}

function createFile(name: string) {
  return new File(["data"], name, { type: "application/vnd.ms-excel" });
}

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

const TestScreen: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>(Mode.PRECOMMANDES);
  const [category, setCategory] = React.useState<Category>(Category.SALON);
  const [data, setData] = React.useState<FlightRow[] | null>(null);
  const [error, setError] = React.useState(false);
  const run = usePythonSubprocess();

  const handleUpload = async (file: File) => {
    try {
      const result = await run("in.xls", "out.json", { mode, category });
      setData(result);
    } catch {
      setError(true);
    }
  };

  return (
    <div>
      <ModeSelector
        mode={mode}
        category={category}
        onChange={(m, c) => {
          setMode(m);
          setCategory(c);
        }}
      />
      <UploadBox onUpload={handleUpload} />
      {data && <FlightTable rows={data} onChange={() => {}} />}
      {error && <p role="alert">Failed</p>}
    </div>
  );
};

test("ipc flow renders rows", async () => {
  const child = createChild();
  spawnMock.mockReturnValue(child);
  readFileMock.mockResolvedValue(JSON.stringify(rows));
  render(<TestScreen />);
  await userEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Prestations à Bord/i }),
  );
  const input = screen.getByTestId("file-input");
  await userEvent.upload(input, createFile("test.xls"));
  child.emit("close", 0);
  await waitFor(() => {
    expect(screen.getByText("AF1")).toBeInTheDocument();
  });
});
