/** @jest-environment jsdom */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModeSelector, Mode } from "./ModeSelector";
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
    jc: 0,
    yc: 0,
  },
];

const TestScreen: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>(Mode.PRECOMMANDES);
  const [data, setData] = React.useState<FlightRow[] | null>(null);
  const [error, setError] = React.useState(false);
  const run = usePythonSubprocess();

  const handleUpload = async (file: File) => {
    try {
      const { exitCode, stderr } = await run("in.xls", "out.json", {
        mode,
      });
      if (exitCode !== 0) throw new Error(stderr);
      const text = await readFile("out.json", "utf8");
      setData(JSON.parse(text));
    } catch {
      setError(true);
    }
  };

  return (
    <div>
      <ModeSelector
        mode={mode}
        onChange={(m) => {
          setMode(m);
        }}
      />
      <UploadBox onUpload={handleUpload} />
      {data && <FlightTable data={data} errors={[]} onEdit={() => {}} />}
      {error && <p role="alert">Failed</p>}
    </div>
  );
};

test.skip("ipc flow renders rows", async () => {
  const child = createChild();
  spawnMock.mockReturnValue(child);
  readFileMock.mockResolvedValue(JSON.stringify(rows));
  render(<TestScreen />);
  await userEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  const input = screen.getByTestId("file-input");
  await userEvent.upload(input, createFile("test.xls"));
  child.emit("close", 0);
  await waitFor(() => {
    expect(screen.getByText("AF1")).toBeInTheDocument();
  });
});
