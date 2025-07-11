/** @jest-environment jsdom */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModeSelector } from "./ModeSelector";

test("clicking mode button triggers onChange", () => {
  const handleChange = jest.fn();
  render(
    <ModeSelector
      mode="precommandes"
      category="salon"
      onChange={handleChange}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: /Commandes Définitives/i }),
  );
  expect(handleChange).toHaveBeenCalledWith("commandes", "salon");
});

test("clicking category button triggers onChange", () => {
  const handleChange = jest.fn();
  render(
    <ModeSelector
      mode="precommandes"
      category="salon"
      onChange={handleChange}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /Prestations à Bord/i }));
  expect(handleChange).toHaveBeenCalledWith("precommandes", "prestations");
});

test("active classes match props", () => {
  render(
    <ModeSelector
      mode="commandes"
      category="prestations"
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
