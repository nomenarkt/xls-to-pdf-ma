/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModeSelector, Mode } from "./ModeSelector";

test("clicking mode button triggers onChange", async () => {
  const handleChange = jest.fn();
  render(<ModeSelector mode={Mode.PRECOMMANDES} onChange={handleChange} />);
  await userEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  expect(handleChange).toHaveBeenCalledWith(Mode.COMMANDES);
});

test("active classes match props", () => {
  render(<ModeSelector mode={Mode.COMMANDES} onChange={() => {}} />);
  const commandes = screen.getByRole("button", {
    name: /Commandes Définitives/i,
  });
  expect(commandes.className).toMatch(/bg-blue-600/);
});
