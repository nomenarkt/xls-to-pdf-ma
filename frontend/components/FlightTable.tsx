import React from "react";
import { FlightRow } from "../shared/types/flight";
import { useSeatClassInput } from "../shared/hooks/useSeatClassInput";

export interface FlightTableProps {
  rows: FlightRow[];
  onChange: (updatedRow: FlightRow) => void;
}

export const FlightTable: React.FC<FlightTableProps> = ({ rows, onChange }) => {
  const SeatInput: React.FC<{
    value: number;
    onValid: (val: number) => void;
    label: string;
  }> = ({ value, onValid, label }) => {
    const {
      value: val,
      error,
      handleChange,
      handleBlur,
    } = useSeatClassInput(value, onValid);
    return (
      <div>
        <input
          type="number"
          min={0}
          max={99}
          step={1}
          aria-label={label}
          className={`w-20 border rounded px-1 ${error ? "border-red-500" : ""}`}
          value={val}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {error && (
          <span role="alert" className="text-red-600 text-xs">
            Invalid
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-y-auto max-h-96">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">Num Vol</th>
            <th className="px-2 py-1 text-left">Départ</th>
            <th className="px-2 py-1 text-left">Arrivée</th>
            <th className="px-2 py-1 text-left">Imma</th>
            <th className="px-2 py-1 text-left">SD LOC</th>
            <th className="px-2 py-1 text-left">SA LOC</th>
            <th className="px-2 py-1 text-left">J/C</th>
            <th className="px-2 py-1 text-left">Y/C</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.num_vol} className="odd:bg-white even:bg-gray-50">
              <td className="px-2 py-1">{r.num_vol}</td>
              <td className="px-2 py-1">{r.depart}</td>
              <td className="px-2 py-1">{r.arrivee}</td>
              <td className="px-2 py-1">{r.imma}</td>
              <td className="px-2 py-1">{r.sd_loc}</td>
              <td className="px-2 py-1">{r.sa_loc}</td>
              <td className="px-2 py-1">
                <SeatInput
                  value={r.j_class ?? 0}
                  onValid={(val) => onChange({ ...r, j_class: val })}
                  label={`J class for ${r.num_vol}`}
                />
              </td>
              <td className="px-2 py-1">
                <SeatInput
                  value={r.y_class ?? 0}
                  onValid={(val) => onChange({ ...r, y_class: val })}
                  label={`Y class for ${r.num_vol}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
