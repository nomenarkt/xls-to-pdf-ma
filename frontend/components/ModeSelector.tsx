import React from "react";

export type Mode = "precommandes" | "commandes";
export type Category = "salon" | "prestations";

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
          className={`${base} ${mode === "precommandes" ? active : inactive}`}
          onClick={handleMode("precommandes")}
        >
          Pré-commandes
        </button>
        <button
          type="button"
          className={`${base} ${mode === "commandes" ? active : inactive}`}
          onClick={handleMode("commandes")}
        >
          Commandes Définitives
        </button>
      </div>
      <div role="group" aria-label="category" className="flex space-x-2">
        <button
          type="button"
          className={`${base} ${category === "salon" ? active : inactive}`}
          onClick={handleCategory("salon")}
        >
          Salon
        </button>
        <button
          type="button"
          className={`${base} ${category === "prestations" ? active : inactive}`}
          onClick={handleCategory("prestations")}
        >
          Prestations à Bord
        </button>
      </div>
    </div>
  );
};
