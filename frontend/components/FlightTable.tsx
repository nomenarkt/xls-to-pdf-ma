import React from "react";
import clsx from "clsx";
import { FlightRow, RowError } from "../shared/types/flight";
import { useSeatClassInput } from "../shared/hooks/useSeatClassInput";

export interface FlightTableProps {
  data: FlightRow[];
  errors: RowError[];
  onEdit: (updatedRow: FlightRow) => void;
}

export const FlightTable: React.FC<FlightTableProps> = ({
  data,
  errors,
  onEdit,
}) => {
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
          {data.map((r) => {
            const hasError = errors.some((e) => e.num_vol === r.num_vol);
            return (
              <tr
                key={r.num_vol}
                className={clsx(
                  "odd:bg-white even:bg-gray-50",
                  hasError && "bg-red-50",
                )}
              >
                <td className="px-2 py-1">
                  {r.num_vol}
                  {hasError && (
                    <span
                      role="status"
                      aria-label="error"
                      className="ml-1 text-red-600"
                    >
                      !
                    </span>
                  )}
                </td>
                <td className="px-2 py-1">{r.depart}</td>
                <td className="px-2 py-1">{r.arrivee}</td>
                <td className="px-2 py-1">{r.imma}</td>
                <td className="px-2 py-1">{r.sd_loc}</td>
                <td className="px-2 py-1">{r.sa_loc}</td>
                <td className="px-2 py-1">
                  <SeatInput
                    value={r.jc ?? 0}
                    onValid={(val) => {
                      onEdit({ ...r, jc: val });
                    }}
                    label={`J class for ${r.num_vol}`}
                  />
                </td>
                <td className="px-2 py-1">
                  <SeatInput
                    value={r.yc ?? 0}
                    onValid={(val) => {
                      onEdit({ ...r, yc: val });
                    }}
                    label={`Y class for ${r.num_vol}`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
