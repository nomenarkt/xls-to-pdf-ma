/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ModeSelector, Mode, Category } from "./ModeSelector";

test("clicking mode button triggers onChange", async () => {
  const handleChange = jest.fn();
  render(
    <ModeSelector
      mode={Mode.PRECOMMANDES}
      category={Category.SALON}
      onChange={handleChange}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  expect(handleChange).toHaveBeenCalledWith(Mode.COMMANDES, Category.SALON);
});

test("clicking category button triggers onChange", async () => {
  const handleChange = jest.fn();
  render(
    <ModeSelector
      mode={Mode.PRECOMMANDES}
      category={Category.SALON}
      onChange={handleChange}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Prestations à Bord/i }),
  );
  expect(handleChange).toHaveBeenCalledWith(
    Mode.PRECOMMANDES,
    Category.PRESTATIONS,
  );
});

test("active classes match props", () => {
  render(
    <ModeSelector
      mode={Mode.COMMANDES}
      category={Category.PRESTATIONS}
      onChange={() => {}}
    />,
  );
  const commandes = screen.getByRole("button", {
    name: /Commandes Définitives/i,
  });
  const prestations = screen.getByRole("button", {
    name: /Prestations à Bord/i,
  });
  expect(commandes.className).toMatch(/bg-blue-600/);
  expect(prestations.className).toMatch(/bg-blue-600/);
});
