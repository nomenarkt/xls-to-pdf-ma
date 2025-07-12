import React from "react";
import { FlightRow } from "../shared/types/flight";

export interface FlightTableProps {
  rows: FlightRow[];
  onChange: (updatedRow: FlightRow) => void;
}

export const FlightTable: React.FC<FlightTableProps> = ({ rows, onChange }) => {
  const handleNumberChange =
    (field: "j_class" | "y_class", row: FlightRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      const safeValue = Number.isNaN(value) ? 0 : value;
      onChange({ ...row, [field]: safeValue });
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
                <input
                  type="number"
                  className="w-20 border rounded px-1"
                  value={r.j_class ?? 0}
                  onChange={handleNumberChange("j_class", r)}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  className="w-20 border rounded px-1"
                  value={r.y_class ?? 0}
                  onChange={handleNumberChange("y_class", r)}
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
