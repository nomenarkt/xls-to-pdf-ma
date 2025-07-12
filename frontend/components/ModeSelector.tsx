import React from "react";

export const Mode = {
  PRECOMMANDES: "precommandes",
  COMMANDES: "commandes",
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

export const Category = {
  SALON: "salon",
  PRESTATIONS: "prestations",
} as const;
export type Category = (typeof Category)[keyof typeof Category];

export interface ModeSelectorProps {
  mode: Mode;
  category: Category;
  onChange: (mode: Mode, category: Category) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  category,
  onChange,
}) => {
  const handleMode = (next: Mode) => () => {
    if (next !== mode) {
      onChange(next, category);
    }
  };

  const handleCategory = (next: Category) => () => {
    if (next !== category) {
      onChange(mode, next);
    }
  };

  const base = "px-4 py-2 rounded";
  const active = "bg-blue-600 text-white";
  const inactive = "bg-gray-200";

  return (
    <div>
      <div role="group" aria-label="mode" className="flex space-x-2 mb-2">
        <button
          type="button"
          className={`${base} ${mode === Mode.PRECOMMANDES ? active : inactive}`}
          onClick={handleMode(Mode.PRECOMMANDES)}
        >
          Pré-commandes
        </button>
        <button
          type="button"
          className={`${base} ${mode === Mode.COMMANDES ? active : inactive}`}
          onClick={handleMode(Mode.COMMANDES)}
        >
          Commandes Définitives
        </button>
      </div>
      <div role="group" aria-label="category" className="flex space-x-2">
        <button
          type="button"
          className={`${base} ${category === Category.SALON ? active : inactive}`}
          onClick={handleCategory(Category.SALON)}
        >
          Salon
        </button>
        <button
          type="button"
          className={`${base} ${category === Category.PRESTATIONS ? active : inactive}`}
          onClick={handleCategory(Category.PRESTATIONS)}
        >
          Prestations à Bord
        </button>
      </div>
    </div>
  );
};
