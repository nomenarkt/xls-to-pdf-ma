/** @jest-environment jsdom */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UploadBox } from "./UploadBox";

function createFile(
  name: string,
  type = "application/vnd.ms-excel",
  size = 1000,
) {
  const file = new File(["data"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

test("rejects wrong file types", () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("bad.txt", "text/plain");
  fireEvent.change(input, { target: { files: [file] } });
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Only .xls files are allowed",
  );
  expect(onUpload).not.toHaveBeenCalled();
});

test("show filename after selection", () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("ok.xls");
  fireEvent.change(input, { target: { files: [file] } });
  expect(screen.getByText("ok.xls")).toBeInTheDocument();
});

test("triggers upload callback", () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("ok.xls");
  fireEvent.change(input, { target: { files: [file] } });
  expect(onUpload).toHaveBeenCalledWith(file);
});
