/** @jest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "../shared/api/axios";
import { ModeSelector, Mode, Category } from "./ModeSelector";
import { UploadBox } from "./UploadBox";
import { useProcessXLS } from "../shared/hooks/useProcessXLS";
import { FlightRow } from "../shared/types/flight";
import { FlightTable } from "./FlightTable";

jest.mock("../shared/api/axios");

const mockedPost = (axios as jest.Mocked<typeof axios>).post;

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
  const processXLS = useProcessXLS();

  const handleUpload = async (file: File) => {
    try {
      const res = await processXLS(file, mode, category);
      setData(res);
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

test("valid flow renders rows", async () => {
  mockedPost.mockResolvedValue({ status: 200, data: rows });
  render(<TestScreen />);
  fireEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  fireEvent.click(screen.getByRole("button", { name: /Prestations à Bord/i }));
  const input = screen.getByTestId("file-input");
  fireEvent.change(input, { target: { files: [createFile("test.xls")] } });
  await waitFor(() => {
    expect(screen.getByText("AF1")).toBeInTheDocument();
  });
  expect(mockedPost).toHaveBeenCalledWith("/process", expect.any(FormData));
});

test("error response shows fallback", async () => {
  mockedPost.mockRejectedValue(new Error("bad"));
  render(<TestScreen />);
  const input = screen.getByTestId("file-input");
  fireEvent.change(input, { target: { files: [createFile("test.xls")] } });
  await waitFor(() => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
