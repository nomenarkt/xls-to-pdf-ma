/** @jest-environment jsdom */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModeSelector, Mode } from "./ModeSelector";
import { UploadBox } from "./UploadBox";
import { useProcessXLS } from "../shared/hooks/useProcessXLS";
import { FlightRow } from "../shared/types/flight";
import { FlightTable } from "./FlightTable";
import { usePythonSubprocess } from "../shared/hooks/usePythonSubprocess";

jest.mock("../shared/hooks/usePythonSubprocess", () => ({
  __esModule: true,
  usePythonSubprocess: jest.fn(),
}));

const runMock = jest.fn();
(usePythonSubprocess as jest.Mock).mockReturnValue(runMock);

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
  const processXLS = useProcessXLS();

  const handleUpload = async (file: File) => {
    try {
      const res = await processXLS(file, mode);
      setData(res);
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

test.skip("valid flow renders rows", async () => {
  runMock.mockResolvedValue({ stdout: "", stderr: "", exitCode: 0 });
  render(<TestScreen />);
  await userEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  const input = screen.getByTestId("file-input");
  await userEvent.upload(input, createFile("test.xls"));
  await waitFor(() => {
    expect(screen.getByText("AF1")).toBeInTheDocument();
  });
  expect(runMock).toHaveBeenCalled();
});

test.skip("error response shows fallback", async () => {
  runMock.mockRejectedValue(new Error("bad"));
  render(<TestScreen />);
  const input = screen.getByTestId("file-input");
  await userEvent.upload(input, createFile("test.xls"));
  await waitFor(() => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
