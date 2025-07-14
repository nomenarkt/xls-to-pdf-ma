import React from "react";

export const Mode = {
  PRECOMMANDES: "precommandes",
  COMMANDES: "commandes",
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

export interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onChange,
}) => {
  const handleMode = (next: Mode) => () => {
    if (next !== mode) {
      onChange(next);
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
    </div>
  );
};
