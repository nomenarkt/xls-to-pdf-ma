/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("rejects wrong file types", async () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("bad.txt", "text/plain");
  await userEvent.upload(input, file, { applyAccept: false });
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Only .xls files are allowed",
  );
  expect(onUpload).not.toHaveBeenCalled();
});

test("show filename after selection", async () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("ok.xls");
  await userEvent.upload(input, file);
  expect(await screen.findByText("ok.xls")).toBeInTheDocument();
});

test("triggers upload callback", async () => {
  const onUpload = jest.fn();
  render(<UploadBox onUpload={onUpload} />);
  const input = screen.getByTestId("file-input");
  const file = createFile("ok.xls");
  await userEvent.upload(input, file);
  expect(onUpload).toHaveBeenCalledWith(file);
});
